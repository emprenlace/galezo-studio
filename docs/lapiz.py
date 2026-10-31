"""Foto -> boceto a lápiz con profundidad: contorno grueso en las aristas principales, línea fina en los detalles,
aguada de grafito en las sombras y achurado cruzado que se cierra según la oscuridad. Papel casi blanco."""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
src, out = sys.argv[1], sys.argv[2]
rng = np.random.default_rng(7)
im = Image.open(src).convert('RGB'); W, H = im.size
k = W / 1600
sim = im
for _ in range(3): sim = sim.filter(ImageFilter.MedianFilter(int(5 * k) | 1))
g = nd.gaussian_filter(np.asarray(sim.convert('L'), np.float32) / 255, 1.0 * k)
# contraste local: separa planos de la fachada para dar volumen
lo = nd.gaussian_filter(g, 40 * k)
g = np.clip(g + (g - lo) * 0.55, 0, 1)

def edges(sig, thr, gain):
    gs = nd.gaussian_filter(g, sig * k)
    gx = nd.sobel(gs, 1); gy = nd.sobel(gs, 0); m = np.hypot(gx, gy)
    m = m / (np.percentile(m, 99.4) + 1e-6)
    peak = m >= nd.maximum_filter(m, size=int(3 * k) | 1) * 0.8
    return np.clip((m - thr) * gain, 0, 1) * peak
bold = edges(2.2, 0.42, 2.4)          # aristas principales: más gruesas y oscuras
bold = nd.grey_dilation(bold, size=(max(2, int(2.2 * k)),) * 2)
fine = edges(0.9, 0.24, 1.7)           # detalles
line = np.clip(bold * 1.0 + fine * 0.65, 0, 1)
line = nd.gaussian_filter(line, 0.55 * k)

# tono: 0 claro, 1 oscuro
tone = np.clip((0.66 - nd.gaussian_filter(g, 3 * k)) / 0.58, 0, 1)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
def hatch(angle, sp, width=0.55):
    a = np.deg2rad(angle); u = xx * np.cos(a) + yy * np.sin(a)
    wob = nd.gaussian_filter(rng.standard_normal((H, W)).astype(np.float32), 22 * k) * 16 * k
    ph = ((u + wob) % (sp * k)) / (sp * k)
    l = np.clip(1 - np.abs(ph - 0.5) * sp * width, 0, 1)
    br = nd.gaussian_filter(rng.random((H, W)).astype(np.float32), 5 * k)
    return l * np.clip((br - br.mean()) * 10 + 0.85, 0, 1)
hat = (hatch(-42, 5.5) * np.clip((tone - 0.18) / 0.25, 0, 1) * 0.55
       + hatch(42, 6) * np.clip((tone - 0.42) / 0.22, 0, 1) * 0.55
       + hatch(-78, 6.5) * np.clip((tone - 0.64) / 0.2, 0, 1) * 0.5)
# aguada de grafito: sombra suave que da profundidad
wash = nd.gaussian_filter(tone, 2.5 * k) ** 1.6 * 0.3

ink = np.clip(line * 0.97 + hat * 0.75 + wash - line * wash * 0.3, 0, 1)
grain = nd.gaussian_filter(rng.standard_normal((H, W)).astype(np.float32), 0.8 * k)
ink = np.clip(ink * (0.86 + grain * 0.18), 0, 1)
paper = np.array([247, 245, 240], np.float32) * (1 + grain[..., None] * 0.008)
graph = np.array([30, 33, 40], np.float32)
rgb = paper * (1 - ink[..., None] * 0.92) + graph * ink[..., None] * 0.92
Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(out, quality=86)
