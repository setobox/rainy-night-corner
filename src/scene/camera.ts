// OrbitControls protects its spherical pole with this same epsilon.
export const TOP_POLAR = 0.000001
export const DEFAULT_POSITION: [number, number, number] = [17, 12, 24]
export const DEFAULT_TARGET: [number, number, number] = [0, 1.5, 0]

export function orthographicFrustum(width: number, height: number) {
  return { left: -width / 2, right: width / 2, top: height / 2, bottom: -height / 2 }
}
