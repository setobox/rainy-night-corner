import { useCallback, useRef } from 'react'
import type { ComponentRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Vector3 } from 'three'
import { DEFAULT_POSITION, DEFAULT_TARGET, orthographicFrustum, TOP_POLAR } from './camera'

export function CameraRig() {
  const { size } = useThree()
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const fitZoom = Math.min(size.width / 25.8, size.height / 22)

  const clampTarget = useCallback(() => {
    const orbit = controls.current
    if (!orbit) return
    const target = orbit.target
    const bounded = new Vector3(Math.max(-2.3, Math.min(2.3, target.x)), Math.max(0.4, Math.min(3.5, target.y)), Math.max(-2.3, Math.min(2.3, target.z)))
    const change = bounded.sub(target)
    if (change.lengthSq() > 0) { orbit.object.position.add(change); target.add(change) }
  }, [])

  return <>
    <OrthographicCamera makeDefault manual {...orthographicFrustum(size.width, size.height)} position={DEFAULT_POSITION}
      zoom={fitZoom} near={0.1} far={150} />
    <OrbitControls ref={controls} makeDefault target={DEFAULT_TARGET} enableDamping={false} rotateSpeed={0.8}
      minPolarAngle={TOP_POLAR} maxPolarAngle={Math.PI / 2} minZoom={fitZoom * 0.75} maxZoom={fitZoom * 3.4}
      onChange={clampTarget} />
  </>
}
