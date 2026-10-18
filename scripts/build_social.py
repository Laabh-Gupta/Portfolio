"""Render the graphite/lime portfolio sharing composition; requires Pillow."""
from pathlib import Path
from math import sin, cos, pi
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent
scale = 2
image = Image.new('RGB', (1200 * scale, 630 * scale), '#10110e')
draw = ImageDraw.Draw(image)
fontroot = Path('C:/Windows/Fonts')
def text(x, y, value, size, color='#f5f3e9', bold=False):
    font = ImageFont.truetype(str(fontroot / ('segoeuib.ttf' if bold else 'segoeui.ttf')), size * scale)
    draw.text((x * scale, y * scale), value, font=font, fill=color)
def line(points, fill='#34392c'):
    draw.line(tuple(v * scale for v in points), fill=fill, width=scale)

text(56, 32, 'lg.', 32, '#c9f85c', True)
text(140, 48, 'INTELLIGENCE, ENGINEERED.', 12, '#aab49c')
text(930, 48, 'SELECTED PORTFOLIO', 12, '#aab49c')
line((56, 104, 1144, 104))
text(49, 129, 'Laabh', 111, bold=True)
text(49, 245, 'Gupta.', 111, bold=True)
text(59, 397, 'Making intelligence work in the real world.', 21, '#c9f85c')
points = []
for i in range(64 * 25):
    u, v = (i % 64) / 64 * 2 * pi, (i // 64) / 25 * 2 * pi
    r = 132 + 53 * cos(v)
    x, y, z = r * cos(u), r * sin(u), 53 * sin(v)
    yy, zz = y * cos(.92) - z * sin(.92), y * sin(.92) + z * cos(.92)
    points.append((zz, 900 + x * cos(-.58) - yy * sin(-.58), 309 + x * sin(-.58) + yy * cos(-.58)))
for depth, x, y in sorted(points):
    alpha = .2 + ((depth + 190) / 380) * .8
    color = tuple(round(a * alpha + b * (1-alpha)) for a,b in zip((201,248,92),(16,17,14)))
    rad = 1.6 * scale
    draw.ellipse((x*scale-rad,y*scale-rad,x*scale+rad,y*scale+rad), fill=color)
line((56, 514, 1144, 514))
text(56, 547, 'AI/ML  /  SOFTWARE ENGINEERING  /  MLOPS', 15, '#aab49c')
text(891, 547, 'AI & Data Engineer @ EY', 15, '#aab49c')
image.resize((1200,630),Image.Resampling.LANCZOS).save(root / 'public' / 'social-card.png', optimize=True)
print('Created public/social-card.png (1200 x 630)')
