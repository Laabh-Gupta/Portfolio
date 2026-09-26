"""Render a code-designed social sharing card; requires Pillow."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parent.parent
image=Image.new('RGB',(1200,630),'#0b0f12')
d=ImageDraw.Draw(image)
fontroot=Path('C:/Windows/Fonts')
def font(size,bold=False):
    return ImageFont.truetype(str(fontroot/('segoeuib.ttf' if bold else 'segoeui.ttf')),size)
for x in range(650,1200,28):
    for y in range(0,630,28): d.ellipse((x,y,x+1,y+1),fill='#293945')
d.rounded_rectangle((64,57,118,111),radius=13,fill='#20313d',outline='#526e82')
d.text((76,62),'lg',font=font(28,True),fill='#bfdbf2')
d.text((139,69),'ENGINEERING INTELLIGENCE. END TO END.',font=font(17),fill='#9eb4c5')
d.text((64,198),'Laabh Gupta.',font=font(80,True),fill='#eff4f8')
d.text((68,312),'AI/ML Engineer  /  Software Engineer',font=font(28),fill='#cadae6')
d.text((68,357),'MLOps & DevOps',font=font(28),fill='#b4d7f3')
d.line((68,482,1132,482),fill='#2e3c46',width=1)
d.text((68,520),'AI & Data Engineer @ EY GDS',font=font(20),fill='#a7b8c5')
d.text((778,520),'laabh-portfolio.netlify.app',font=font(20),fill='#a7b8c5')
for index in range(2,-1,-1):
    y=174+index*62
    d.polygon([(824,y),(950,y-73),(1090,y),(950,y+78)],fill=['#2d4251','#233441','#192934'][index],outline='#658ca8',width=2)
for (x,y) in [(901,164),(955,133),(1008,167),(951,199)]:
    d.line((950,171,x,y),fill='#9dc9eb',width=2)
    d.ellipse((x-5,y-5,x+5,y+5),fill='#b9daf4')
image.save(root/'public'/'social-card.png',optimize=True)
print('Created public/social-card.png (1200 x 630)')
