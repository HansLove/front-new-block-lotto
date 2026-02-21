/**
 * Deterministic hex color from ticketId for per-card orb accent.
 * Uses a simple string hash → hue in a pleasant range (teal to purple), fixed S/V.
 */

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

/**
 * HSV to RGB, then to hex.
 * h in [0, 360), s and v in [0, 1].
 */
function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);
  return '#' + [R, G, B].map(n => n.toString(16).padStart(2, '0')).join('');
}

/** Hue range 150–330 (teal through blue/purple, avoid dull yellow). S≈0.75, V≈0.95. */
const HUE_MIN = 150;
const HUE_SPAN = 180;
const SATURATION = 0.75;
const VALUE = 0.95;

/**
 * Returns a stable hex color for the given ticketId.
 * Same id always yields the same color.
 */
export function ticketIdToHex(ticketId: string): string {
  if (!ticketId || typeof ticketId !== 'string') {
    return '#0d9488';
  }
  const h = hashString(ticketId);
  const hue = HUE_MIN + (h % 0x7fff) / 0x7fff * HUE_SPAN;
  const s = clamp01(SATURATION);
  const v = clamp01(VALUE);
  return hsvToHex(hue, s, v);
}
