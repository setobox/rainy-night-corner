import { describe, expect, it } from 'vitest'
import { OrthographicCamera, Vector3 } from 'three'
import { DEFAULT_TARGET, TOP_POLAR, orthographicFrustum } from './camera'

const VIEW_ANGLES = {
  front: { polar: Math.PI / 2, azimuth: 0 },
  right: { polar: Math.PI / 2, azimuth: Math.PI / 2 },
  top: { polar: TOP_POLAR, azimuth: 0 },
} as const

describe('standard orthographic views', () => {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    for (const view of ['front', 'right', 'top'] as const) {
      it(`${view} keeps parallel edges and equal scale at ${width} × ${height}`, () => {
        const frustum = orthographicFrustum(width, height)
        const camera = new OrthographicCamera(frustum.left, frustum.right, frustum.top, frustum.bottom, 0.1, 150)
        camera.zoom = Math.min(width / 25.8, height / 22)
        const { polar, azimuth } = VIEW_ANGLES[view]
        camera.position.setFromSphericalCoords(32, polar, azimuth).add(new Vector3(...DEFAULT_TARGET))
        camera.lookAt(new Vector3(...DEFAULT_TARGET))
        camera.updateMatrixWorld(); camera.updateProjectionMatrix()
        const corners = view === 'top' ? [[-8, 0, -8], [8, 0, -8], [8, 0, 8], [-8, 0, 8]]
          : view === 'front' ? [[-4, 0, 0], [4, 0, 0], [4, 4, 0], [-4, 4, 0]]
            : [[0, 0, -4], [0, 0, 4], [0, 4, 4], [0, 4, -4]]
        const points = corners.map(([x, y, z]) => {
          const p = new Vector3(x, y, z).project(camera)
          return { x: p.x * width / 2, y: p.y * height / 2 }
        })
        const distance = (a: number, b: number) => Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y)
        expect(points[0].y).toBeCloseTo(points[1].y, 5)
        expect(points[2].y).toBeCloseTo(points[3].y, 5)
        expect(points[0].x).toBeCloseTo(points[3].x, 5)
        expect(points[1].x).toBeCloseTo(points[2].x, 5)
        expect(distance(0, 1)).toBeCloseTo(distance(3, 2), 5)
        expect(distance(0, 1) / distance(1, 2)).toBeCloseTo(view === 'top' ? 1 : 2, 5)
      })
    }
  }
})
