from pathlib import Path
import os
from PIL import Image, ImageDraw

root = Path('experience/evidence') / os.environ.get('GTP_EVIDENCE_DIR', 'scroll-current-2026-10-27')
for viewport, size in [('projector', (320, 180)), ('phone', (160, 346))]:
    width, height = size
    for first in (1, 6, 11):
        sheet = Image.new('RGB', (width * 3, (height + 24) * 5), '#101d19')
        draw = ImageDraw.Draw(sheet)
        for row, scene in enumerate(range(first, first + 5)):
            for column, beat in enumerate((0, 50, 90)):
                source = root / f'{viewport}-{scene:02d}-{beat:02d}.png'
                with Image.open(source) as original:
                    frame = original.convert('RGB').resize(size)
                x, y = column * width, row * (height + 24)
                sheet.paste(frame, (x, y + 24))
                draw.text((x + 8, y + 5), f'{scene:02d} / {beat:02d}', fill='#f4e8d8')
        sheet.save(root / f'{viewport}-contact-{first:02d}-{first+4:02d}.jpg', quality=85)
