/**
 * Génère les icônes PWA ETERNITY en PNG pur (sans dépendance native) :
 * lemniscate de Bernoulli en stroke doré sur fond #0A0A0A.
 * Usage : node scripts/gen-icons.mjs
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------- Minimal PNG encoder ----------
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const row = y * (1 + width * 4);
    raw[row] = 0; // filter none
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- Lemniscate rasterizer ----------
function goldAt(x) {
  // léger dégradé horizontal or clair -> or -> or foncé
  const stops = [
    [0.0, [230, 205, 156]],
    [0.5, [201, 169, 110]],
    [1.0, [154, 122, 66]],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (x >= t0 && x <= t1) {
      const f = (x - t0) / (t1 - t0);
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * f));
    }
  }
  return stops[stops.length - 1][1];
}

function renderIcon(size, { padding = 0.16, stroke = 0.1 } = {}) {
  const px = Buffer.alloc(size * size * 4);
  const bg = [10, 10, 10];
  // fond + vignette radiale subtile dorée
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const dx = (x - size / 2) / size;
      const dy = (y - size / 2) / size;
      const d = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.max(0, 1 - d * 1.9) * 0.09;
      px[i] = Math.round(bg[0] + 201 * glow);
      px[i + 1] = Math.round(bg[1] + 169 * glow);
      px[i + 2] = Math.round(bg[2] + 110 * glow);
      px[i + 3] = 255;
    }
  }
  // lemniscate : échantillonnage + tampons de disques anti-aliasés (supersampling x2)
  const ss = 2;
  const big = size * ss;
  const mask = new Float32Array(big * big);
  const span = 1 - padding; // moitié de la largeur de la courbe (normalisé)
  const a = (big / 2) * span;
  const cy = big / 2;
  const cx = big / 2;
  const r = big * stroke * 0.62;
  const steps = Math.floor(big * 6);
  const disks = [];
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * Math.PI * 2;
    const sin = Math.sin(t);
    const cos = Math.cos(t);
    const denom = 1 + sin * sin;
    const x = cx + (a * cos) / denom;
    const y = cy + (a * sin * cos) / denom * 0.92;
    disks.push([x, y]);
  }
  // resample pour égaliser la densité
  const points = [];
  for (let i = 1; i < disks.length; i++) {
    const [x0, y0] = disks[i - 1];
    const [x1, y1] = disks[i];
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(1, Math.round(dist / (r / 3)));
    for (let k = 0; k < n; k++) {
      points.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
    }
  }
  const rr = Math.ceil(r);
  for (const [pxc, pyc] of points) {
    for (let dy = -rr; dy <= rr; dy++) {
      for (let dx = -rr; dx <= rr; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > r) continue;
        const mx = Math.round(pxc + dx);
        const my = Math.round(pyc + dy);
        if (mx < 0 || my < 0 || mx >= big || my >= big) continue;
        const cover = Math.min(1, Math.max(0, r - d));
        mask[my * big + mx] = Math.min(1, mask[my * big + mx] + cover * 0.55);
      }
    }
  }
  // downsample + composition or masqué
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let m = 0;
      for (let sy = 0; sy < ss; sy++)
        for (let sx = 0; sx < ss; sx++) m += mask[(y * ss + sy) * big + x * ss + sx];
      m /= ss * ss;
      if (m <= 0.01) continue;
      const i = (y * size + x) * 4;
      const gold = goldAt(x / size);
      px[i] = Math.round(px[i] * (1 - m) + gold[0] * m);
      px[i + 1] = Math.round(px[i + 1] * (1 - m) + gold[1] * m);
      px[i + 2] = Math.round(px[i + 2] * (1 - m) + gold[2] * m);
    }
  }
  return px;
}

const targets = [
  { file: 'public/icons/icon-192.png', size: 192, opts: {} },
  { file: 'public/icons/icon-512.png', size: 512, opts: {} },
  { file: 'public/icons/maskable-512.png', size: 512, opts: { padding: 0.26, stroke: 0.085 } },
  { file: 'public/icons/apple-touch-icon.png', size: 180, opts: {} },
  { file: 'public/icons/favicon-32.png', size: 32, opts: { padding: 0.12, stroke: 0.13 } },
];

for (const t of targets) {
  const rgba = renderIcon(t.size, t.opts);
  const png = encodePng(t.size, t.size, rgba);
  const out = join(root, t.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, png);
  console.log(`✔ ${t.file} (${t.size}x${t.size})`);
}
