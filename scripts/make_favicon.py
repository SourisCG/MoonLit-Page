#!/usr/bin/env python3
"""Genera favicon.ico (y favicon.png) con el logo MoonLit: luna + play, rojo -> azul."""
import math
import os

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False

from PIL import Image, ImageDraw

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "images")
OUT_DIR = os.path.abspath(OUT_DIR)
os.makedirs(OUT_DIR, exist_ok=True)

BASE = 1024  # resolucion 4x para suavizado
RED = (239, 68, 68)
BLUE = (59, 130, 246)

# --- Geometria: proporciones EXACTAS del CSS del logo ---
# CSS: .logo 28x28, luna inset:0 (radio = 50% de la caja),
# hueco: radial-gradient(circle at 68% 50%, transparent 44%, #000 45%)
# play: 7x9px centrado en (68%,50%), apuntando a la derecha hacia el centro del hueco
CX, CY = BASE / 2, BASE / 2
R = 0.50 * BASE            # radio de la luna (inset:0)
HX, HY = 0.68 * BASE, 0.50 * BASE  # centro del hueco
HR = 0.44 * BASE           # radio del hueco (44% de la caja)

# --- Triángulo de play: base a la izquierda, punta en el centro del hueco ---
PLAY_W, PLAY_H = 7 / 28 * BASE, 9 / 28 * BASE
tri_points = [
    (HX - PLAY_W, HY - PLAY_H / 2),
    (HX - PLAY_W, HY + PLAY_H / 2),
    (HX, HY),
]

alpha = Image.new("L", (BASE, BASE), 0)
d = ImageDraw.Draw(alpha)
d.ellipse([CX - R, CY - R, CX + R, CY + R], fill=255)
d.ellipse([HX - HR, HY - HR, HX + HR, HY + HR], fill=0)
d.polygon(tri_points, fill=255)

# --- Color: gradiente diagonal rojo -> azul ---
if HAS_NUMPY:
    y, x = np.mgrid[0:BASE, 0:BASE]
    t = (x + y) / (2.0 * BASE)
    t = np.clip(t, 0.0, 1.0)
    r = (RED[0] + (BLUE[0] - RED[0]) * t).astype(np.uint8)
    g = (RED[1] + (BLUE[1] - RED[1]) * t).astype(np.uint8)
    b = (RED[2] + (BLUE[2] - RED[2]) * t).astype(np.uint8)
    color = np.dstack([r, g, b])
    color_img = Image.fromarray(color, "RGB")
else:
    color_img = Image.new("RGB", (BASE, BASE))
    px = color_img.load()
    for yy in range(BASE):
        for xx in range(BASE):
            t = min(1.0, max(0.0, (xx + yy) / (2.0 * BASE)))
            px[xx, yy] = (
                int(RED[0] + (BLUE[0] - RED[0]) * t),
                int(RED[1] + (BLUE[1] - RED[1]) * t),
                int(RED[2] + (BLUE[2] - RED[2]) * t),
            )

# --- Componer y reducir a 256 ---
d2 = ImageDraw.Draw(color_img)
d2.polygon(tri_points, fill=(255, 255, 255))
result = color_img.convert("RGBA")
result.putalpha(alpha)
result = result.resize((256, 256), Image.LANCZOS)

png_path = os.path.join(OUT_DIR, "favicon.png")
ico_path = os.path.join(OUT_DIR, "favicon.ico")
result.save(png_path)
result.save(ico_path, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

print("Generados:")
print("  ", png_path)
print("  ", ico_path)
