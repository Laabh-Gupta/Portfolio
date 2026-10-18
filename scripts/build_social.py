"""Render the graphite/lime portfolio sharing composition; requires Pillow."""
from pathlib import Path
import ast
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
geometry = (root / 'src' / 'data' / 'portrait.ts').read_text(encoding='utf-8')
points_text = geometry.split('export const portraitPoints:', 1)[1].split('= ', 1)[1].split(';', 1)[0]
for x, y, depth, intensity in sorted(ast.literal_eval(points_text), key=lambda p: p[2]):
    alpha = .22 + intensity * .75
    color = tuple(round(a * alpha + b * (1-alpha)) for a,b in zip((201,248,92),(16,17,14)))
    rad = (.55 + intensity * .7) * scale
    px, py = (650 + x * .9) * scale, (75 + y * .9) * scale
    draw.ellipse((px-rad,py-rad,px+rad,py+rad), fill=color)
line((56, 514, 1144, 514))
text(56, 547, 'AI/ML  /  SOFTWARE ENGINEERING  /  MLOPS', 15, '#aab49c')
text(891, 547, 'AI & Data Engineer @ EY', 15, '#aab49c')
image.resize((1200,630),Image.Resampling.LANCZOS).save(root / 'public' / 'social-card.png', optimize=True)
print('Created public/social-card.png (1200 x 630)')
