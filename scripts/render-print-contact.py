"""Render each PDF page and a few inspection sheets for the GTP handout."""
import json
import sys
from pathlib import Path

import fitz
from PIL import Image, ImageDraw

folder = Path(sys.argv[1])
pdf = fitz.open(folder / "print.pdf")
pages = []
text_rows = []
for index, page in enumerate(pdf):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
    path = folder / f"page-{index + 1:02d}.png"
    pix.save(path)
    pages.append(path)
    text = page.get_text().strip()
    text_rows.append({"page": index + 1, "characters": len(text), "opening": text[:120]})

for start in range(0, len(pages), 7):
    subset = pages[start:start + 7]
    width, height = 320, 475
    sheet = Image.new("RGB", (width * len(subset), height + 35), "#e9e9e5")
    pen = ImageDraw.Draw(sheet)
    for column, path in enumerate(subset):
        picture = Image.open(path).convert("RGB")
        picture.thumbnail((width - 14, height - 14))
        x = column * width + (width - picture.width) // 2
        sheet.paste(picture, (x, 7))
        pen.text((column * width + 12, height + 6), f"PAGE {start + column + 1:02d}", fill="#26392f")
    sheet.save(folder / f"contact-{start // 7 + 1:02d}.png")

(folder / "page-inspection.json").write_text(json.dumps(text_rows, indent=2), encoding="utf-8")
print(json.dumps({"pages": len(pages), "blankTextPages": [row["page"] for row in text_rows if row["characters"] < 40], "contactSheets": (len(pages) + 6) // 7}))
