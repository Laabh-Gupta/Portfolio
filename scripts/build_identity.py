"""Build one geometry-only identity study from seven local face-landmark sets.

No image pixels are loaded. All references contribute to a robust generalized
Procrustes mean. The face is measured; the cranium, ears and neck are interpreted
volumes that allow the study to rotate beyond a frontal camera view.
"""

from __future__ import annotations

import argparse
import collections
import json
import math
from pathlib import Path

import numpy as np


ANCHORS = np.array([
    1, 2, 4, 5, 6, 19, 33, 45, 48, 64, 94, 98, 127, 133,
    168, 195, 197, 234, 263, 275, 278, 294, 327, 356, 362, 454,
])
INNER_LIP = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95]


def cycle(edges: list[dict[str, int]]) -> list[int]:
    adjacency: dict[int, list[int]] = {}
    for e in edges:
        a, b = e["start"], e["end"]
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


def initial_normalization(points: np.ndarray) -> np.ndarray:
    origin = (points[33] + points[263]) / 2
    x_axis = points[263] - points[33]
    eye_span = np.linalg.norm(x_axis)
    x_axis /= eye_span
    y_axis = points[10] - points[152]
    y_axis -= x_axis * np.dot(y_axis, x_axis)
    y_axis /= np.linalg.norm(y_axis)
    z_axis = np.cross(x_axis, y_axis)
    z_axis /= np.linalg.norm(z_axis)
    basis = np.column_stack([x_axis, y_axis, z_axis])
    return (points - origin) @ basis / eye_span


def similarity(source: np.ndarray, target: np.ndarray) -> tuple[np.ndarray, dict]:
    a, b = source[ANCHORS], target[ANCHORS]
    ca, cb = a.mean(axis=0), b.mean(axis=0)
    ac, bc = a - ca, b - cb
    u, singular, vt = np.linalg.svd(ac.T @ bc)
    sign = np.ones(3)
    if np.linalg.det(u @ vt) < 0:
        sign[-1] = -1
    rotation = u @ np.diag(sign) @ vt
    scale = float(np.sum(singular * sign) / np.sum(ac * ac))
    result = (source - ca) @ rotation * scale + cb
    rms = float(np.sqrt(np.mean(np.sum((result[ANCHORS] - target[ANCHORS]) ** 2, axis=1))))
    return result, {"scale": scale, "anchorRms": rms, "rotation": rotation}


def build_mean(images: dict, connections: dict) -> tuple[np.ndarray, dict]:
    if len(images) != 7:
        raise ValueError("Exactly seven landmark references are required")
    oval = cycle(connections["FACE_OVAL"])
    names, shapes, raw_weights, pose_angles, apertures = [], [], [], [], []
    for name, image in images.items():
        width, height = image["width"], image["height"]
        data = image["landmarks"]
        if len(data) != 478:
            raise ValueError(f"{name} does not contain 478 landmarks")
        points = np.array([[p["x"] * width, -p["y"] * height, -p["z"] * width] for p in data])
        normalized = initial_normalization(points)
        eye_pixels = float(np.linalg.norm(points[263, :2] - points[33, :2]))
        matrix = np.array(image["matrices"][0]["data"]).reshape(4, 4, order="F")[:3, :3]
        # Matrices assess capture pose; the actual alignment fits subject anchors.
        angle = math.acos(float(np.clip((np.trace(matrix) - 1) / 2, -1, 1)))
        quality = np.clip(math.sqrt(eye_pixels / 240), 0.61, 1.15) * max(0.65, math.cos(angle))
        names.append(name)
        shapes.append(normalized)
        raw_weights.append(float(quality))
        pose_angles.append(math.degrees(angle))
        apertures.append(float(np.linalg.norm(normalized[13] - normalized[14])))

    shapes_array = np.array(shapes)
    reference_weights = np.array(raw_weights)
    reference_weights /= reference_weights.sum()
    mouth_vertices = np.array(sorted({e[k] for e in connections["LIPS"] for k in ["start", "end"]}))
    aperture_median = float(np.median(apertures))
    expression_weights = 0.55 + 0.45 * np.exp(-np.abs(np.array(apertures) - aperture_median) / 0.028)

    # The initial frame is only an orientation seed. Subsequent means include all7.
    template = shapes_array[names.index("photo7")].copy()
    reports = []
    for iteration in range(14):
        aligned, reports = [], []
        for shape in shapes_array:
            current, report = similarity(shape, template)
            aligned.append(current)
            reports.append(report)
        aligned = np.array(aligned)
        residual = np.linalg.norm(aligned - template, axis=2)
        robust_scale = np.median(residual, axis=0) * 2.8 + 0.014
        robust_weight = np.clip(1 / (1 + (residual / robust_scale) ** 2), 0.18, 1)
        weights = reference_weights[:, None] * robust_weight
        weights[:, mouth_vertices] *= expression_weights[:, None]
        mean = np.sum(aligned * weights[:, :, None], axis=0) / weights.sum(axis=0)[:, None]
        # Coordinate-wise median tempers transient expressions without excluding a
        # reference: 82% of every measured vertex remains an all-reference mean.
        median = np.median(aligned, axis=0)
        mean[mouth_vertices] = 0.82 * mean[mouth_vertices] + 0.18 * median[mouth_vertices]
        template = mean

    # Keep actual subject asymmetry. Only align the shared eye line and head axis.
    mean = initial_normalization(template)
    face_width = np.ptp(mean[oval, 0])
    mean *= 2.2 / face_width
    y_mid = (mean[10, 1] + mean[152, 1]) / 2
    mean[:, 1] -= y_mid
    # A natural face plane gives the posterior volume enough room behind it.
    mean[:, 2] -= np.mean(mean[[33, 133, 263, 362], 2])
    mean[:, 2] += 0.25
    contribution = weights / weights.sum(axis=0)
    contribution[:, mouth_vertices] *= 0.82
    for vertex in mouth_vertices:
        for coordinate in range(3):
            median_reference = int(np.argsort(aligned[:, vertex, coordinate])[len(names) // 2])
            contribution[median_reference, vertex] += 0.18 / 3
    references = []
    for i, name in enumerate(names):
        references.append({
            "id": name,
            "weight": round(float(reference_weights[i]), 5),
            "meanVertexContribution": round(float(contribution[i].mean()), 5),
            "minimumVertexContribution": round(float(contribution[i].min()), 5),
            "capturePoseDegrees": round(pose_angles[i], 2),
            "expressionWeight": round(float(expression_weights[i]), 4),
            "alignmentRms": round(reports[i]["anchorRms"], 5),
        })
    report = {
        "referenceCount": 7,
        "landmarksPerReference": 478,
        "method": "Aspect-correct xyz; 14 iterations of robust generalized similarity Procrustes over stable eye, nose and cheek anchors; expression-weighted all-reference mean.",
        "expressionReduction": "Mouth residuals are downweighted and tempered with an 18% coordinate median; all seven references retain nonzero contributions.",
        "pixelTexturesUsed": False,
        "normalization": {"faceWidth": 2.2, "yUp": True, "zTowardViewer": True, "symmetrized": False},
        "references": references,
    }
    return mean, report


def orient_and_audit(vertices: np.ndarray, triangles: list[list[int]]) -> tuple[list[list[int]], dict]:
    adjacency = collections.defaultdict(list)
    for i, t in enumerate(triangles):
        for a, b in zip(t, t[1:] + t[:1]):
            adjacency[tuple(sorted((a, b)))].append((i, a, b))
    if any(len(entries) != 2 for entries in adjacency.values()):
        counts = collections.Counter(len(e) for e in adjacency.values())
        raise ValueError(f"Surface is not closed manifold: {dict(counts)}")

    oriented: list[list[int] | None] = [None] * len(triangles)
    components = []
    for seed in range(len(triangles)):
        if oriented[seed] is not None:
            continue
        oriented[seed] = list(triangles[seed])
        queue = collections.deque([seed])
        component = []
        while queue:
            i = queue.popleft()
            component.append(i)
            triangle = oriented[i]
            for a, b in zip(triangle, triangle[1:] + triangle[:1]):
                for j, _, _ in adjacency[tuple(sorted((a, b)))]:
                    if j == i:
                        continue
                    if oriented[j] is None:
                        candidate = list(triangles[j])
                        same = any(x == a and y == b for x, y in zip(candidate, candidate[1:] + candidate[:1]))
                        oriented[j] = candidate[::-1] if same else candidate
                        queue.append(j)
                    elif any(x == a and y == b for x, y in zip(oriented[j], oriented[j][1:] + oriented[j][:1])):
                        raise ValueError("Inconsistent surface orientation")
        volume = sum(float(np.dot(vertices[oriented[i][0]], np.cross(vertices[oriented[i][1]], vertices[oriented[i][2]]))) / 6 for i in component)
        if volume < 0:
            for i in component:
                oriented[i] = oriented[i][::-1]
        components.append({"triangles": len(component), "volume": round(abs(volume), 5)})
    result = [list(t) for t in oriented]
    edge_count = len(adjacency)
    return result, {"closedComponents": len(components), "components": components, "edgeCount": edge_count, "boundaryEdges": 0, "nonManifoldEdges": 0, "consistentOutwardWinding": True}


def build(source: Path, target: Path, report_path: Path) -> None:
    data = json.loads(source.read_text(encoding="utf-8"))
    connections = data["connections"]
    face, metadata = build_mean(data["images"], connections)
    vertices = face.tolist()
    triangles: list[list[int]] = []
    tess = connections["TESSELATION"]
    for i in range(0, len(tess), 3):
        group = tess[i:i + 3]
        unique = list(dict.fromkeys([group[0]["start"], group[0]["end"], group[1]["end"]]))
        if len(unique) != 3:
            raise ValueError("Invalid face triangle")
        triangles.append(unique)
    measured_triangle_count = len(triangles)

    # Close each eye with an annulus from the measured eyelid to measured iris.
    for eye_name, iris_name, center in [("RIGHT_EYE", "RIGHT_IRIS", 468), ("LEFT_EYE", "LEFT_IRIS", 473)]:
        outer = cycle(connections[eye_name])
        inner = cycle(connections[iris_name])
        origin = face[center, :2]
        def angular(indices):
            return sorted([(float(math.atan2(face[i, 1] - origin[1], face[i, 0] - origin[0]) % (2 * math.pi)), i) for i in indices])
        a, b = angular(outer), angular(inner)
        oi = ii = 0
        # Start both loops on the same ray and advance the earlier next event.
        while oi < len(a) or ii < len(b):
            outer_now, inner_now = a[oi % len(a)][1], b[ii % len(b)][1]
            outer_next = a[(oi + 1) % len(a)][0] + (2 * math.pi if oi + 1 >= len(a) else 0)
            inner_next = b[(ii + 1) % len(b)][0] + (2 * math.pi if ii + 1 >= len(b) else 0)
            if oi < len(a) and (ii >= len(b) or outer_next <= inner_next):
                triangles.append([outer_now, a[(oi + 1) % len(a)][1], inner_now])
                oi += 1
            else:
                triangles.append([outer_now, b[(ii + 1) % len(b)][1], inner_now])
                ii += 1
        for a, b in zip(inner, inner[1:] + inner[:1]):
            triangles.append([center, a, b])

    mouth_center = len(vertices)
    vertices.append(np.mean(face[INNER_LIP], axis=0).tolist())
    for a, b in zip(INNER_LIP, INNER_LIP[1:] + INNER_LIP[:1]):
        triangles.append([mouth_center, a, b])
    face_surface_triangle_count = len(triangles)

    # Exact measured oval → smooth posterior rings. The crown extends above the
    # detected forehead; this is interpreted volume, not unobserved measurement.
    oval = cycle(connections["FACE_OVAL"])
    boundary = face[oval]
    crown_start = len(vertices)
    posterior_start = len(triangles)
    cy = 0.12
    top = np.max(boundary[:, 1])
    bottom = np.min(boundary[:, 1])
    previous = oval
    for t in [0.13, 0.27, 0.42, 0.57, 0.71, 0.84, 0.94]:
        theta = math.pi * t / 2
        factor = math.cos(theta)
        ring = []
        for p in boundary:
            upper = max(0, (p[1] - cy) / (top - cy))
            lower = max(0, (cy - p[1]) / (cy - bottom))
            x = p[0] * factor * (1 + 0.055 * math.sin(math.pi * t))
            y = cy + (p[1] - cy) * factor + 1.01 * math.sin(math.pi * t) * upper ** 2 + 0.22 * math.sin(math.pi * t) * lower ** 1.6
            # Quadratic boundary influence reaches a smooth tangent at the back
            # pole instead of tapering the skull into a cone in profile.
            z = p[2] * factor ** 2 - 1.62 * math.sin(theta)
            ring.append(len(vertices))
            vertices.append([float(x), float(y), float(z)])
        for i in range(len(oval)):
            j = (i + 1) % len(oval)
            triangles.extend([[previous[i], previous[j], ring[i]], [previous[j], ring[j], ring[i]]])
        previous = ring
    pole = len(vertices)
    vertices.append([0, cy, -1.62])
    for i in range(len(oval)):
        triangles.append([previous[i], previous[(i + 1) % len(oval)], pole])
    crown_end = len(vertices)

    def ellipsoid(center: list[float], radius: list[float], rings: int, segments: int) -> tuple[int, int]:
        start = len(vertices)
        upper = len(vertices)
        vertices.append([center[0], center[1] + radius[1], center[2]])
        loops = []
        for j in range(1, rings):
            phi = math.pi * j / rings
            loop = []
            for i in range(segments):
                theta = 2 * math.pi * i / segments
                loop.append(len(vertices))
                vertices.append([center[0] + radius[0] * math.sin(phi) * math.cos(theta), center[1] + radius[1] * math.cos(phi), center[2] + radius[2] * math.sin(phi) * math.sin(theta)])
            loops.append(loop)
        lower = len(vertices)
        vertices.append([center[0], center[1] - radius[1], center[2]])
        for i in range(segments):
            j = (i + 1) % segments
            triangles.extend([[upper, loops[0][i], loops[0][j]], [lower, loops[-1][j], loops[-1][i]]])
        for a, b in zip(loops, loops[1:]):
            for i in range(segments):
                j = (i + 1) % segments
                triangles.extend([[a[i], b[i], a[j]], [a[j], b[i], b[j]]])
        return start, len(vertices)

    ear_start = len(vertices)
    for side in [-1, 1]:
        ellipsoid([side * 1.02, -0.08, -0.61], [0.15, 0.32, 0.13], 6, 12)
    ear_end = len(vertices)

    neck_start = len(vertices)
    neck_loops = []
    for y, rx, rz, zc in [(-0.84, 0.37, 0.35, -0.72), (-1.4, 0.4, 0.38, -0.73), (-2.1, 0.53, 0.47, -0.77)]:
        loop = []
        for i in range(16):
            theta = 2 * math.pi * i / 16
            loop.append(len(vertices))
            vertices.append([rx * math.cos(theta), y, zc + rz * math.sin(theta)])
        neck_loops.append(loop)
    for a, b in zip(neck_loops, neck_loops[1:]):
        for i in range(16):
            j = (i + 1) % 16
            triangles.extend([[a[i], b[i], a[j]], [a[j], b[i], b[j]]])
    for loop, y, zc in [(neck_loops[0], -0.84, -0.72), (neck_loops[-1], -2.1, -0.77)]:
        center = len(vertices)
        vertices.append([0, y, zc])
        for i in range(16):
            triangles.append([center, loop[i], loop[(i + 1) % 16]])

    vertices_array = np.array(vertices)
    triangles, audit = orient_and_audit(vertices_array, triangles)
    normals = np.zeros_like(vertices_array)
    areas = []
    for a, b, c in triangles:
        normal = np.cross(vertices_array[b] - vertices_array[a], vertices_array[c] - vertices_array[a])
        areas.append(float(np.linalg.norm(normal) / 2))
        normals[[a, b, c]] += normal
    norms = np.linalg.norm(normals, axis=1)
    normals /= np.maximum(norms[:, None], 1e-12)
    if not np.isfinite(vertices_array).all() or min(areas) <= 1e-9 or np.any(norms < 1e-10):
        raise ValueError("Nonfinite coordinates, degenerate triangles or unused vertices")
    audit.update({"minimumTriangleArea": round(min(areas), 8), "unusedVertices": int(np.sum(norms < 1e-10)), "unitNormals": True})

    edges = {
        tuple(sorted((e["start"], e["end"])))
        for name in ["LEFT_EYE", "RIGHT_EYE", "LEFT_EYEBROW", "RIGHT_EYEBROW", "LIPS", "LEFT_IRIS", "RIGHT_IRIS"]
        for e in connections[name]
    }
    # Accent the actual jaw, not the detector's inferred forehead boundary.
    edges.update(
        tuple(sorted((e["start"], e["end"])))
        for e in connections["FACE_OVAL"]
        if (face[e["start"], 1] + face[e["end"], 1]) / 2 < 0.35
    )
    for route in [[168, 6, 197, 195, 5, 4, 1], [98, 97, 2, 326, 327], [98, 64, 48, 115, 220], [327, 294, 278, 344, 440]]:
        edges.update(tuple(sorted(pair)) for pair in zip(route, route[1:]))

    metadata.update({
        "measuredVertexCount": 478,
        "measuredTriangleCount": measured_triangle_count,
        "faceSurfaceTriangleCount": face_surface_triangle_count,
        "proceduralParts": {
            "cranium": {"startVertex": crown_start, "endVertex": crown_end},
            "ears": {"startVertex": ear_start, "endVertex": ear_end},
            "neck": {"startVertex": neck_start, "endVertex": len(vertices)},
        },
        "interpretation": "Facial structure is an aggregate of seven measured landmark sets. Eye/mouth closure and the posterior cranium, ears and neck are interpreted geometry, not a photogrammetric scan.",
        "vertexCount": len(vertices),
        "triangleCount": len(triangles),
        "featureEdgeCount": len(edges),
        "bounds": {"min": np.min(vertices_array, axis=0).round(4).tolist(), "max": np.max(vertices_array, axis=0).round(4).tolist()},
        "topology": audit,
    })
    header = (
        "/** Geometry-only identity study aggregated from all seven supplied references.\n"
        " * Measured face: robust pose-aligned landmark mean. No photograph, pixel\n"
        " * luminance, image mask or texture is embedded. Cranium, ears and neck\n"
        " * are interpreted volumes; see identityMetadata for contribution/audit data.\n"
        " * World coordinates: x right, y up, z toward the viewer.\n"
        " */\n\n"
    )
    def flat(name: str, values: np.ndarray | list, rounding: int | None, row: int) -> str:
        values = np.array(values).ravel().tolist()
        if rounding is not None:
            values = [round(float(v), rounding) + 0.0 for v in values]
        lines = ["  " + ",".join(str(v) for v in values[i:i + row]) + "," for i in range(0, len(values), row)]
        return f"export const {name}: number[] = [\n" + "\n".join(lines) + "\n];\n\n"
    text = header
    text += flat("identityVertices", vertices_array, 5, 9)
    text += flat("identityNormals", normals, 5, 9)
    text += flat("identityTriangles", triangles, None, 18)
    text += flat("identityFeatureEdges", sorted(edges), None, 16)
    text += "export const identityMetadata = " + json.dumps(metadata, indent=2) + " as const;\n"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8")
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("tmp/identity-landmarks.json"))
    parser.add_argument("--out", type=Path, default=Path("src/data/identity.ts"))
    parser.add_argument("--report", type=Path, default=Path("output/identity-normalization.json"))
    args = parser.parse_args()
    build(args.input, args.out, args.report)
