/** Seeded PRNG (32-bit LCG) for deterministic simulation replay. */
export function createRng(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h * 1664525 + 1013904223) | 0;
    return (h >>> 0) / 0xffffffff;
  };
}

/** Standard normal sample via Box-Muller transform. */
export function randomNormal(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) {
    u = rng();
  }
  while (v === 0) {
    v = rng();
  }
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
