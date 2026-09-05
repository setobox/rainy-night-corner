import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { ACESFilmicToneMapping, PCFShadowMap } from 'three'
import { Ground } from './scene/Ground'
import { Store } from './scene/Store'
import { StreetProps } from './scene/StreetProps'
import { Weather } from './scene/Weather'
import { CameraRig } from './scene/CameraRig'
import { DEFAULT_POSITION } from './scene/camera'

function Visibility() {
  const setFrameloop = useThree(state => state.setFrameloop)
  const invalidate = useThree(state => state.invalidate)
  useEffect(() => {
    const update = () => { setFrameloop(document.hidden ? 'never' : 'always'); if (!document.hidden) invalidate() }
    document.addEventListener('visibilitychange', update)
    update()
    return () => document.removeEventListener('visibilitychange', update)
  }, [invalidate, setFrameloop])
  return null
}

export function App() {
  const [lowQuality, setLowQuality] = useState(false)
  return <main className="scene" aria-label="雨夜便利店三维微缩景观，可拖动旋转、平移和缩放">
    <Canvas orthographic camera={{ position: DEFAULT_POSITION, near: 0.1, far: 150 }} shadows={{ type: PCFShadowMap }} dpr={lowQuality ? 1 : 1.75} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
      <color attach="background" args={['#141e32']} />
      <fog attach="fog" args={['#141e32', 42, 85]} />
      <CameraRig />
      <Visibility />
      <PerformanceMonitor bounds={() => [40, 65]} onDecline={() => setLowQuality(true)} />
      <ambientLight color="#adbdd7" intensity={0.8} />
      <hemisphereLight args={['#b2cbe7', '#516777', 1.45]} />
      <directionalLight position={[-5, 12, 8]} color="#bccbe9" intensity={2.1} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12}
        shadow-camera-top={12} shadow-camera-bottom={-12} shadow-normalBias={0.035} shadow-bias={-0.0002} />
      <directionalLight position={[6, 7, -8]} color="#7daaba" intensity={1.2} />
      <Ground lowQuality={lowQuality} />
      <Store />
      <StreetProps />
      <Weather lowQuality={lowQuality} />
      {import.meta.env.DEV && <DevelopmentMetrics />}
      <EffectComposer multisampling={lowQuality ? 0 : 2}>
        <Bloom luminanceThreshold={1.2} intensity={0.27} mipmapBlur resolutionScale={lowQuality ? 0.35 : 0.5} />
      </EffectComposer>
    </Canvas>
  </main>
}

function DevelopmentMetrics() {
  const sample = useRef({ elapsed: 0, frames: 0, reports: 0 })
  useFrame(({ gl }, delta) => {
    if (sample.current.reports >= 3 || delta > 0.5) return
    sample.current.elapsed += delta; sample.current.frames++
    if (sample.current.elapsed >= 12) {
      console.info('[scene-metrics]', JSON.stringify({ fps: Math.round(sample.current.frames / sample.current.elapsed),
        geometries: gl.info.memory.geometries, textures: gl.info.memory.textures,
        programs: gl.info.programs?.length, width: gl.domElement.clientWidth, height: gl.domElement.clientHeight, dpr: gl.getPixelRatio() }))
      sample.current.elapsed = 0; sample.current.frames = 0; sample.current.reports++
    }
  })
  return null
}
