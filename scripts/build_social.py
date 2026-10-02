"""Render the original monochrome typographic sharing composition; requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent
fontroot = Path('C:/Windows/Fonts')
scale = 2
image = Image.new('RGB', (1200 * scale, 630 * scale), '#0b0b0b')
draw = ImageDraw.Draw(image)

def font(size, bold=False):
    return ImageFont.truetype(str(fontroot / ('segoeuib.ttf' if bold else 'segoeui.ttf')), size * scale)

def text(x, y, value, size, color='#f1f0eb', bold=False):
    draw.text((x * scale, y * scale), value, font=font(size, bold), fill=color)

def line(points, fill='#393939'):
    draw.line(tuple(v * scale for v in points), fill=fill, width=scale)

text(56, 36, 'lg.', 32, bold=True)
text(140, 51, 'INTELLIGENCE, ENGINEERED.', 13, '#aaa9a4')
text(855, 51, 'AI / SOFTWARE / SYSTEMS', 13, '#aaa9a4')
line((56, 110, 1144, 110))
text(56, 151, 'Intelligence is', 49)
text(56, 206, 'only the beginning.', 49)
text(59, 299, 'I build the systems around it.', 20, '#aaa9a4')
# Layered letterpress identity, drawn from type rather than an external image.
for depth in range(18, 0, -1):
    text(894 + depth, 117 + depth, 'LG', 135, '#333333', True)
text(894, 117, 'LG', 135, '#dddcd6', True)
text(51, 349, 'LAABH GUPTA', 128, '#f1f0eb', True)
line((56, 526, 1144, 526))
text(56, 553, 'AI/ML Engineer  /  Software Engineer  /  MLOps & DevOps', 17, '#aaa9a4')
text(890, 553, 'AI & Data Engineer @ EY', 17, '#aaa9a4')
image.resize((1200, 630), Image.Resampling.LANCZOS).save(root / 'public' / 'social-card.png', optimize=True)
print('Created public/social-card.png (1200 x 630)')
