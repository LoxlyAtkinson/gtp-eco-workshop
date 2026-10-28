from pathlib import Path
import os
from PIL import Image, ImageDraw

root = Path('experience/evidence') / os.environ.get('GTP_EVIDENCE_DIR', 'handoffs-current-2026-10-27')
for viewport, size in [('projector', (400, 225)), ('phone', (160, 346))]:
    width, height = size
    for first in (1, 8):
        sheet = Image.new('RGB', (width * 2, (height + 24) * 4), '#101d19')
        draw = ImageDraw.Draw(sheet)
        for index, handoff in enumerate(range(first, first + 7)):
            source = root / f'{viewport}-{handoff:02d}-50.png'
            with Image.open(source) as original:
                frame = original.convert('RGB').resize(size)
            x, y = index % 2 * width, index // 2 * (height + 24)
            sheet.paste(frame, (x, y + 24))
            draw.text((x + 8, y + 5), f'HANDOFF {handoff:02d} / 50', fill='#f4e8d8')
        sheet.save(root / f'{viewport}-mid-contact-{first:02d}-{first+6:02d}.jpg', quality=85)
