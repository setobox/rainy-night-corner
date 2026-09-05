export const STORE = { minX: -4.8, maxX: 4.1, minZ: -5.59, maxZ: 0.99, roof: 5.05 }

export function smoothstep(value: number): number {
  const x = Math.max(0, Math.min(1, value))
  return x * x * (3 - 2 * x)
}

export function doorOpening(time: number): number {
  const phase = ((time % 24) + 24) % 24
  if (phase < 15) return 0
  if (phase < 17) return smoothstep((phase - 15) / 2)
  if (phase < 20) return 1
  if (phase < 22) return 1 - smoothstep((phase - 20) / 2)
  return 0
}

export function safeDelta(delta: number): number {
  return Number.isFinite(delta) ? Math.min(0.05, Math.max(0, delta)) : 0
}

export function rainFloor(x: number, z: number): number {
  if (x >= STORE.minX && x <= STORE.maxX && z >= STORE.minZ && z <= STORE.maxZ) return STORE.roof
  if (x >= -4.75 && x <= 4.05 && z >= 0.7 && z <= 1.4) return 3.82
  return 0.12
}

export function trafficPhase(time: number): 'red' | 'amber' | 'green' {
  const phase = ((time % 30) + 30) % 30
  return phase < 14 ? 'red' : phase < 27 ? 'green' : 'amber'
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 4294967296
  }
}
