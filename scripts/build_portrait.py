"""Derive a deterministic point portrait from a local photo and face landmarks.

Only numeric geometry and an optional vector preview are written. Source photos
are read locally and are never copied into the project.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def polygon_mask(size: tuple[int, int], points: list[tuple[float, float]]) -> np.ndarray:
    mask = Image.new("L", size)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return np.asarray(mask) > 0


def ordered_cycle(edges: list[dict[str, int]]) -> list[int]:
    adjacency: dict[int, list[int]] = {}
    for edge in edges:
        a, b = edge["start"], edge["end"]
        adjacency.setdefault(a, []).append(b)
        adjacency.setdefault(b, []).append(a)
    route = [edges[0]["start"]]
    previous = -1
    while True:
        current = route[-1]
        following = next(i for i in adjacency[current] if i != previous)
        if following == route[0]:
            return route
        route.append(following)
        previous = current


def generate(photo: Path, landmark_file: Path, output: Path, preview: Path | None) -> None:
    source = Image.open(photo).convert("RGB")
    width, height = source.size
    data = json.loads(landmark_file.read_text(encoding="utf-8"))
    image_data = data["images"]["photo4"]
    if (width, height) != (image_data["width"], image_data["height"]):
        raise ValueError("Source photo dimensions do not match the extracted landmarks")
    normalized = image_data["landmarks"]
    landmarks = np.array([[p["x"] * width, p["y"] * height, p["z"] * width] for p in normalized])
    connections = data["connections"]

    # Crown, swept fringe and side hair follow the supplied photo's silhouette.
    hair_outline = [
        (27, 322), (39, 273), (68, 240), (107, 213), (126, 175),
        (152, 150), (180, 125), (211, 82), (242, 61), (266, 45),
        (290, 56), (325, 62), (355, 79), (387, 88), (422, 111),
        (459, 145), (494, 179), (527, 224), (548, 268), (560, 316),
        (555, 361), (545, 408), (534, 458), (519, 498), (503, 535),
        (488, 464), (451, 460), (420, 438), (389, 450), (357, 460),
        (326, 423), (303, 400), (280, 357), (257, 289), (241, 329),
        (221, 365), (184, 387), (149, 422), (120, 455), (103, 494),
        (81, 474), (63, 443), (50, 410), (38, 370),
    ]
    face_outline = landmarks[ordered_cycle(connections["FACE_OVAL"]), :2].tolist()
    neck_outline = [
        (162, 750), (191, 799), (249, 834), (299, 844), (359, 829),
        (415, 787), (444, 749), (476, 810), (487, 854), (464, 888),
        (430, 930), (380, 960), (320, 974), (245, 958), (203, 916),
        (179, 867), (154, 815),
    ]
    shoulder_outline = [
        (158, 768), (105, 805), (39, 830), (0, 845), (0, 897),
        (64, 922), (149, 947), (244, 962), (335, 964), (425, 952),
        (526, 927), (625, 900), (578, 866), (528, 836), (482, 810), (449, 768),
    ]
    hair_mask = polygon_mask(source.size, hair_outline)
    face_mask = polygon_mask(source.size, face_outline)
    neck_mask = polygon_mask(source.size, neck_outline)
    shoulder_mask = polygon_mask(source.size, shoulder_outline)

    rgb = np.asarray(source, dtype=np.float32) / 255
    luminance = rgb @ np.array([0.2126, 0.7152, 0.0722])
    smooth = np.asarray(Image.fromarray((luminance * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1)), dtype=np.float32) / 255
    broad = np.asarray(Image.fromarray((luminance * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)), dtype=np.float32) / 255
    gx = np.roll(smooth, -2, axis=1) - np.roll(smooth, 2, axis=1)
    gy = np.roll(smooth, -2, axis=0) - np.roll(smooth, 2, axis=0)
    edge = np.sqrt(gx * gx + gy * gy)
    detail = np.abs(smooth - broad)

    # Cream/tile background between fine strands is excluded from the hair mask.
    hair_mask &= smooth < 0.55
    silhouette = hair_mask | face_mask | neck_mask | shoulder_mask

    scale = 0.47
    def project_xy(xy: np.ndarray) -> np.ndarray:
        return np.column_stack((260 + (xy[:, 0] - 291) * scale, 50 + (xy[:, 1] - 45) * scale))

    # Stable jitter breaks up a mechanical grid while preserving image structure.
    rng = np.random.default_rng(7241)
    spacing = 8.2
    xs, ys = np.meshgrid(np.arange(23, 629, spacing), np.arange(45, 950, spacing))
    xy = np.column_stack((xs.ravel(), ys.ravel()))
    xy += rng.uniform(-2.25, 2.25, xy.shape)
    pixel = np.rint(xy).astype(int)
    valid = silhouette[pixel[:, 1], pixel[:, 0]]
    xy, pixel = xy[valid], pixel[valid]
    screen = project_xy(xy)
    valid = (screen[:, 1] <= 470) & (screen[:, 0] > 120) & (screen[:, 0] < 420)
    xy, pixel, screen = xy[valid], pixel[valid], screen[valid]
    ix, iy = pixel[:, 0], pixel[:, 1]
    is_face = face_mask[iy, ix]
    is_hair = hair_mask[iy, ix] & ~is_face
    is_neck = neck_mask[iy, ix] & ~is_face & ~is_hair

    # Landmark z is relative; positive output depth points toward the viewer.
    depth = np.full(len(xy), np.nan)
    tessellation = connections["TESSELATION"]
    triangles = []
    for i in range(0, len(tessellation), 3):
        group = tessellation[i:i + 3]
        vertices = list(dict.fromkeys([e["start"] for e in group] + [e["end"] for e in group]))
        if len(vertices) == 3:
            triangles.append(vertices)
    for triangle in triangles:
        a, b, c = landmarks[triangle]
        near = (
            (xy[:, 0] >= min(a[0], b[0], c[0])) & (xy[:, 0] <= max(a[0], b[0], c[0]))
            & (xy[:, 1] >= min(a[1], b[1], c[1])) & (xy[:, 1] <= max(a[1], b[1], c[1]))
        )
        indices = np.flatnonzero(near)
        if not len(indices):
            continue
        denominator = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        if abs(denominator) < 1e-5:
            continue
        points = xy[indices]
        u = ((b[1] - c[1]) * (points[:, 0] - c[0]) + (c[0] - b[0]) * (points[:, 1] - c[1])) / denominator
        v = ((c[1] - a[1]) * (points[:, 0] - c[0]) + (a[0] - c[0]) * (points[:, 1] - c[1])) / denominator
        w = 1 - u - v
        inside = (u >= -0.002) & (v >= -0.002) & (w >= -0.002)
        depth[indices[inside]] = 24 - (u[inside] * a[2] + v[inside] * b[2] + w[inside] * c[2]) * 0.35

    # Iris/mouth openings use nearby measured geometry, not a flat replacement.
    missing_face = np.flatnonzero(is_face & np.isnan(depth))
    for i in missing_face:
        distance = np.sum((landmarks[:, :2] - xy[i]) ** 2, axis=1)
        nearest = np.argsort(distance)[:3]
        weight = 1 / np.maximum(distance[nearest], 0.25)
        depth[i] = 24 - np.average(landmarks[nearest, 2], weights=weight) * 0.35

    # Hair and the small neck/shoulder region complete the measured facial mesh.
    hair_width = np.clip((xy[:, 0] - 294) / 272, -1, 1)
    hair_height = np.clip((xy[:, 1] - 45) / 480, 0, 1)
    hair_depth = -15 + 28 * np.sqrt(np.maximum(0, 1 - hair_width ** 2)) + hair_height * 22
    depth[is_hair] = hair_depth[is_hair]
    neck_depth = -22 + 24 * np.maximum(0, 1 - ((xy[:, 0] - 303) / 170) ** 2)
    depth[is_neck] = neck_depth[is_neck]
    body = ~is_face & ~is_hair & ~is_neck
    depth[body] = -35 + 9 * np.maximum(0, 1 - ((xy[body, 0] - 300) / 330) ** 2)
    depth = np.nan_to_num(depth, nan=-20)

    # Dot brightness preserves the portrait's photographed features and shadows.
    tone = np.clip((smooth[iy, ix] - 0.045) / 0.72, 0, 1)
    intensity = 0.12 + 0.82 * tone ** 0.92
    intensity += np.minimum(0.18, edge[iy, ix] * 0.65 + detail[iy, ix] * 0.9)
    intensity[is_hair] = 0.15 + 0.56 * np.clip(smooth[iy[is_hair], ix[is_hair]] / 0.45, 0, 1) ** 0.9 + np.minimum(0.19, edge[iy[is_hair], ix[is_hair]] * 0.9)
    intensity[body] *= 0.6
    # A soft taper leaves space around the neck instead of drawing a hard bust.
    fade = np.clip((478 - screen[:, 1]) / 62, 0, 1)
    intensity *= 0.22 + 0.78 * fade
    intensity = np.clip(intensity, 0.06, 1)
    keep = rng.random(len(xy)) < np.where(body, 0.57, 0.94)
    screen, depth, intensity = screen[keep], depth[keep], intensity[keep]
    points = [[round(float(x), 1), round(float(y), 1), round(float(z), 1), round(float(t), 2)] for (x, y), z, t in zip(screen, depth, intensity)]
    points.sort(key=lambda p: (p[1], p[0]))

    projected_landmarks = project_xy(landmarks[:, :2])
    landmark_depth = 24 - landmarks[:, 2] * 0.35
    def line(a: int, b: int) -> list[float]:
        return [round(float(v), 1) for v in [*projected_landmarks[a], landmark_depth[a], *projected_landmarks[b], landmark_depth[b]]]

    mesh = []
    seen = set()
    for edge_pair in tessellation:
        a, b = edge_pair["start"], edge_pair["end"]
        key = tuple(sorted((a, b)))
        if key in seen or a >= 468 or b >= 468:
            continue
        seen.add(key)
        if np.linalg.norm(projected_landmarks[a] - projected_landmarks[b]) <= 37:
            mesh.append(line(a, b))

    contour_pairs = set()
    for name in ["CONTOURS", "LEFT_IRIS", "RIGHT_IRIS"]:
        contour_pairs.update(tuple(sorted((e["start"], e["end"]))) for e in connections[name])
    nose_paths = [
        [168, 6, 197, 195, 5, 4, 1],
        [98, 97, 2, 326, 327],
        [98, 64, 48, 115, 220],
        [327, 294, 278, 344, 440],
    ]
    for path in nose_paths:
        contour_pairs.update(tuple(sorted(pair)) for pair in zip(path, path[1:]))
    contours = [line(a, b) for a, b in sorted(contour_pairs) if np.linalg.norm(projected_landmarks[a] - projected_landmarks[b]) <= 49]

    output.parent.mkdir(parents=True, exist_ok=True)
    header = (
        "/** Numeric 2.5D portrait derived locally from a supplied reference photo.\n"
        " * Facial depth follows measured landmarks; dot intensity follows source luminance\n"
        " * and local edge contrast. No photograph or image texture is embedded.\n"
        " * Coordinates use a 520 × 520 viewBox; positive z points toward the viewer.\n"
        " */\n\n"
    )
    def declaration(name: str, tuples: list[list[float]], size: int) -> str:
        signature = ", ".join(["number"] * size)
        rows = ["  [" + ",".join(str(v) for v in row) + "]," for row in tuples]
        return f"export const {name}: [{signature}][] = [\n" + "\n".join(rows) + "\n];\n"
    output.write_text(header + declaration("portraitPoints", points, 4) + "\n" + declaration("portraitMesh", mesh, 6) + "\n" + declaration("portraitContours", contours, 6), encoding="utf-8")

    if preview:
        preview.parent.mkdir(parents=True, exist_ok=True)
        elements = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 520"><rect width="520" height="520" fill="#101210"/>']
        for x, y, z, strength in points:
            radius = 0.4 + strength * 0.75
            elements.append(f'<circle cx="{x}" cy="{y}" r="{radius:.2f}" fill="#cbff72" opacity="{strength:.2f}"/>')
        elements.append('</svg>')
        preview.write_text("".join(elements), encoding="utf-8")
        # A simple geometry render makes local visual QA independent of SVG viewers.
        raster = Image.new("RGB", (1040, 1040), "#101210")
        draw = ImageDraw.Draw(raster)
        for x, y, z, strength in points:
            radius = (0.4 + strength * 0.75) * 2
            color = tuple(round(b * strength + a * (1 - strength)) for a, b in zip((16, 18, 16), (203, 255, 114)))
            draw.ellipse((x * 2 - radius, y * 2 - radius, x * 2 + radius, y * 2 + radius), fill=color)
        raster.save(preview.with_suffix(".png"))
    print(json.dumps({"points": len(points), "mesh": len(mesh), "contours": len(contours), "bbox": [min(p[i] for p in points) for i in [0, 1]] + [max(p[i] for p in points) for i in [0, 1]], "depth": [min(p[2] for p in points), max(p[2] for p in points)], "output": str(output)}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--photo", required=True, type=Path)
    parser.add_argument("--landmarks", type=Path, default=Path("tmp/face-landmarks.json"))
    parser.add_argument("--out", type=Path, default=Path("src/data/portrait.ts"))
    parser.add_argument("--preview", type=Path, default=Path("output/portrait-data.svg"))
    args = parser.parse_args()
    generate(args.photo, args.landmarks, args.out, args.preview)
