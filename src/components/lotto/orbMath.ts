/**
 * Orb visual params derived from attempt magnitude (log scale).
 * Maps 1K..1T range to intensity; 1..5 shells; pulse and noise for activity.
 */

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

export interface OrbParams {
  intensity: number;
  shells: number;
  noise: number;
  pulseSpeed: number;
  scale: number;
}

/**
 * Get orb params from total attempts (log scale).
 * intensity: 0..1 over roughly 1K..1T
 * shells: 1..5 layers
 * pulseSpeed: base animation speed (higher when Plus Ultra)
 */
export function getOrbParams(attemptsTotal: number, isPlusUltra?: boolean): OrbParams {
  const raw = Math.max(0, attemptsTotal);
  const scale = Math.log10(raw + 1);

  // intensity: map 1e3 (3) .. 1e12 (12) to 0..1
  const intensity = clamp01((scale - 3) / (12 - 3));

  // shells: 1 + floor((scale - 3) / 2), clamped 1..5
  const shells = clamp(1 + Math.floor((scale - 3) / 2), 1, 5);

  // subtle noise for wobble
  const noise = 0.02 + intensity * 0.03;

  // pulse: faster when Plus Ultra
  const pulseSpeed = isPlusUltra ? 2.5 : 1;

  return { intensity, shells, noise, pulseSpeed, scale };
}

/**
 * Lerp for smooth transitions when attemptsTotal updates.
 */
export function lerpOrbParams(
  from: OrbParams,
  to: OrbParams,
  t: number
): OrbParams {
  const tClamp = clamp01(t);
  return {
    intensity: from.intensity + (to.intensity - from.intensity) * tClamp,
    shells: Math.round(from.shells + (to.shells - from.shells) * tClamp),
    noise: from.noise + (to.noise - from.noise) * tClamp,
    pulseSpeed: from.pulseSpeed + (to.pulseSpeed - from.pulseSpeed) * tClamp,
    scale: from.scale + (to.scale - from.scale) * tClamp,
  };
}
