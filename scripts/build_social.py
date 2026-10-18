"""Render the sharing card from the universal geometry; requires only Pillow.

The head uses the same pose, projection and lighting as identity/raster.ts.
Backface culling and a per-pixel depth buffer hide posterior surfaces and edges.
No photograph, image texture or historical portrait point cloud is loaded.
"""

from array import array
from pathlib import Path
import json
import math
import re

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
SCALE = 2
WIDTH, HEIGHT = 1200, 630
BACKGROUND = (16, 17, 14)
LIME = (201, 248, 92)


def local_font(bold: bool) -> str:
    candidates = [
        Path("C:/Windows/Fonts") / ("segoeuib.ttf" if bold else "segoeui.ttf"),
        Path("/usr/share/fonts/truetype/dejavu")
        / ("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"),
    ]
    for candidate in candidates:
        if candidate.is_file():
            return str(candidate)
    raise FileNotFoundError("A local Segoe UI or DejaVu Sans font is required")


def geometry_array(source: str, name: str) -> list[float | int]:
    match = re.search(rf"export const {name}: number\[\] = (\[.*?\]);", source, re.S)
    if not match:
        raise ValueError(f"Could not find {name} in identity.ts")
    return json.loads(re.sub(r",\s*]", "]", match.group(1)))


def blend(base: tuple[int, ...], color: tuple[int, ...], opacity: float) -> tuple[int, ...]:
    return tuple(round(a * (1 - opacity) + b * opacity) for a, b in zip(base, color))


def render_head(image: Image.Image) -> None:
    source = (ROOT / "src/data/identity.ts").read_text(encoding="utf-8")
    flat = geometry_array(source, "identityVertices")
    triangles = geometry_array(source, "identityTriangles")
    features = geometry_array(source, "identityFeatureEdges")
    vertices = [flat[i:i + 3] for i in range(0, len(flat), 3)]
    center = [(min(p[i] for p in vertices) + max(p[i] for p in vertices)) / 2 for i in range(3)]
    extent = max(p[1] for p in vertices) - min(p[1] for p in vertices)
    yaw, pitch, camera = -0.16, 0.025, 8.5
    cy, sy, cp, sp = math.cos(yaw), math.sin(yaw), math.cos(pitch), math.sin(pitch)
    size = 400 / extent
    world, projected = [], []
    for vertex in vertices:
        x, y, z = [vertex[i] - center[i] for i in range(3)]
        xx, zz = x * cy + z * sy, z * cy - x * sy
        yy, depth = y * cp - zz * sp, zz * cp + y * sp
        world.append((xx, yy, depth))
        perspective = camera / (camera - depth)
        projected.append(((922 + xx * size * perspective) * SCALE,
                          (307 - yy * size * perspective) * SCALE, depth))

    pixel_width, pixel_height = image.size
    depth_buffer = array("f", [-math.inf]) * (pixel_width * pixel_height)
    pixels = image.load()
    facets, visible_edges = [], set()
    for i in range(0, len(triangles), 3):
        a, b, c = triangles[i:i + 3]
        p, q, r = world[a], world[b], world[c]
        ux, uy, uz = [q[j] - p[j] for j in range(3)]
        vx, vy, vz = [r[j] - p[j] for j in range(3)]
        nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
        length = math.sqrt(nx * nx + ny * ny + nz * nz)
        if not length or nz / length < 0.015:
            continue
        nx, ny, nz = nx / length, ny / length, nz / length
        diffuse = max(0, nx * -0.47 + ny * 0.65 + nz * 0.60)
        specular = max(0, nx * -0.24 + ny * 0.36 + nz * 0.9) ** 20
        light = min(1, 0.13 + diffuse * 0.7 + specular * 0.35 + (1 - nz) ** 2 * 0.12)
        shade = round(25 + light * 200)
        facets.append((a, b, c, (shade, min(255, shade + 3), shade)))
        visible_edges.update(tuple(sorted(pair)) for pair in [(a, b), (b, c), (c, a)])

    for ai, bi, ci, color in facets:
        a, b, c = projected[ai], projected[bi], projected[ci]
        denominator = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
        if abs(denominator) < 1e-8:
            continue
        xmin = max(0, math.floor(min(a[0], b[0], c[0])))
        xmax = min(pixel_width - 1, math.ceil(max(a[0], b[0], c[0])))
        ymin = max(0, math.floor(min(a[1], b[1], c[1])))
        ymax = min(pixel_height - 1, math.ceil(max(a[1], b[1], c[1])))
        for y in range(ymin, ymax + 1):
            for x in range(xmin, xmax + 1):
                u = ((b[1] - c[1]) * (x + .5 - c[0]) + (c[0] - b[0]) * (y + .5 - c[1])) / denominator
                v = ((c[1] - a[1]) * (x + .5 - c[0]) + (a[0] - c[0]) * (y + .5 - c[1])) / denominator
                w = 1 - u - v
                if min(u, v, w) < -1e-8:
                    continue
                depth = camera - 1 / (u / (camera - a[2]) + v / (camera - b[2]) + w / (camera - c[2]))
                offset = y * pixel_width + x
                if depth > depth_buffer[offset]:
                    depth_buffer[offset] = depth
                    pixels[x, y] = color

    def surface_edge(ai: int, bi: int, color: tuple[int, ...], opacity: float, radius: int) -> None:
        a, b = projected[ai], projected[bi]
        steps = max(1, math.ceil(math.hypot(b[0] - a[0], b[1] - a[1]) * 1.3))
        for step in range(steps + 1):
            t = step / steps
            x, y = round(a[0] + (b[0] - a[0]) * t), round(a[1] + (b[1] - a[1]) * t)
            depth = camera - 1 / ((1 - t) / (camera - a[2]) + t / (camera - b[2]))
            for py in range(max(0, y - radius), min(pixel_height, y + radius + 1)):
                for px in range(max(0, x - radius), min(pixel_width, x + radius + 1)):
                    surface = depth_buffer[py * pixel_width + px]
                    if math.isfinite(surface) and depth >= surface - .022:
                        pixels[px, py] = blend(pixels[px, py], color, opacity)

    for a, b in sorted(visible_edges):
        surface_edge(a, b, (226, 233, 224), .17, 0)
    for i in range(0, len(features), 2):
        surface_edge(features[i], features[i + 1], LIME, .53, 0)


def main() -> None:
    image = Image.new("RGB", (WIDTH * SCALE, HEIGHT * SCALE), BACKGROUND)
    draw = ImageDraw.Draw(image)

    def text(x: float, y: float, value: str, size: int, color: str = "#f5f3e9", bold: bool = False) -> None:
        font = ImageFont.truetype(local_font(bold), size * SCALE)
        draw.text((x * SCALE, y * SCALE), value, font=font, fill=color)

    def line(points: tuple[float, ...], fill: str = "#34392c") -> None:
        draw.line(tuple(v * SCALE for v in points), fill=fill, width=SCALE)

    text(56, 32, "lg.", 32, "#c9f85c", True)
    text(140, 48, "INTELLIGENCE, ENGINEERED.", 12, "#aab49c")
    text(930, 48, "SELECTED PORTFOLIO", 12, "#aab49c")
    line((56, 104, 1144, 104))
    text(49, 129, "Laabh", 111, bold=True)
    text(49, 245, "Gupta.", 111, bold=True)
    text(59, 397, "Making intelligence work in the real world.", 21, "#c9f85c")

    draw.ellipse((734 * SCALE, 119 * SCALE, 1110 * SCALE, 495 * SCALE), outline="#24291f", width=SCALE)
    for x, y, direction in [(719, 145, 1), (1126, 145, -1), (719, 475, 1), (1126, 475, -1)]:
        line((x, y, x + direction * 16, y), "#687d3c")
        line((x, y, x, y + (16 if y < 300 else -16)), "#687d3c")
    render_head(image)

    line((56, 514, 1144, 514))
    text(56, 547, "AI/ML  /  SOFTWARE ENGINEERING  /  MLOPS", 15, "#aab49c")
    text(891, 547, "AI & Data Engineer @ EY", 15, "#aab49c")
    target = ROOT / "public/social-card.png"
    image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(target, optimize=True)
    print(f"Created {target.relative_to(ROOT)} ({WIDTH} x {HEIGHT}) from identity.ts")


if __name__ == "__main__":
    main()
