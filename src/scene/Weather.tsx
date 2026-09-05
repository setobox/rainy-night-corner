import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, InstancedMesh, Object3D, ShaderMaterial } from 'three'
import { rainFloor, safeDelta, seededRandom } from './simulation'

// The upper end is offset against the fall direction. A pronounced tilt is
// intentional here so the diagonal remains visible in the default camera.
const RAIN_TILT = { x: -0.78, z: -0.28 }

const rippleVertex = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`
const rippleFragment = `
uniform float uTime;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
void main() {
  vec2 p = vUv * 21.;
  vec2 cell = floor(p);
  float seed = hash(cell);
  float t = fract(uTime * (.32 + seed * .3) + seed * 8.);
  vec2 center = vec2(.24 + .52 * seed, .24 + .52 * hash(cell + 3.));
  float d = length(fract(p) - center);
  float ring = (1. - smoothstep(.009, .024, abs(d - t * .32))) * pow(1. - t, 2.);
  ring += (1. - smoothstep(.007, .018, abs(d - t * .22))) * pow(1. - t, 3.) * .4;
  gl_FragColor = vec4(.54, .75, .8, ring * .34);
}`

function Ripples() {
  const material = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((_, delta) => { if (material.current) material.current.uniforms.uTime.value += safeDelta(delta) })
  return <mesh position={[0, -0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[15.98, 15.98]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={rippleVertex} fragmentShader={rippleFragment} transparent depthWrite={false} />
  </mesh>
}

function Rain({ lowQuality }: { lowQuality: boolean }) {
  const count = lowQuality ? 360 : 820
  const data = useMemo(() => {
    const random = seededRandom(1983)
    const particles = Array.from({ length: 1350 }, () => ({ x: (random() - 0.5) * 15.6, y: random() * 11, z: (random() - 0.5) * 15.6, speed: 5.3 + random() * 3.1, length: 0.16 + random() * 0.18 }))
    return { particles, positions: new Float32Array(1350 * 6) }
  }, [])
  const attr = useRef<BufferAttribute>(null)
  useFrame((_, delta) => {
    const dt = safeDelta(delta)
    for (let i = 0; i < count; i++) {
      const p = data.particles[i]
      // Advance along the same diagonal as the rendered streak. Wrapping the
      // horizontal drift keeps the rain field filled instead of letting it
      // collect at one edge of the diorama.
      p.x -= dt * p.speed * RAIN_TILT.x
      p.z -= dt * p.speed * RAIN_TILT.z
      if (p.x > 7.8) p.x -= 15.6
      if (p.z > 7.8) p.z -= 15.6
      p.y -= dt * p.speed
      if (p.y < rainFloor(p.x, p.z)) p.y = 10 + (i % 11) / 11
      data.positions.set([p.x, p.y, p.z, p.x + RAIN_TILT.x * p.length, p.y + p.length, p.z + RAIN_TILT.z * p.length], i * 6)
    }
    if (attr.current) attr.current.needsUpdate = true
  })
  return <lineSegments frustumCulled={false}>
    <bufferGeometry drawRange={{ start: 0, count: count * 2 }}>
      <bufferAttribute ref={attr} attach="attributes-position" args={[data.positions, 3]} />
    </bufferGeometry>
    <shaderMaterial transparent depthWrite={false}
      vertexShader={`varying float vFade; void main() { vFade = (1.-smoothstep(7.2,10.8,position.y)) * (1.-smoothstep(6.8,7.9,max(abs(position.x),abs(position.z)))); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`}
      fragmentShader={`varying float vFade; void main() { gl_FragColor=vec4(.70,.82,.90,vFade*.13); }`} />
  </lineSegments>
}

function EaveDrops() {
  const ref = useRef<InstancedMesh>(null), time = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])
  useFrame((_, delta) => {
    time.current += safeDelta(delta)
    if (!ref.current) return
    for (let i = 0; i < 42; i++) {
      const t = (time.current * (0.65 + (i % 5) * 0.06) + i * 0.731) % 1
      dummy.position.set(-4.59 + (i / 41) * 8.52, 3.6 - t * t * 3.44, 1.33)
      dummy.scale.set(0.012, 0.025 + t * 0.07, 0.012); dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={ref} args={[undefined, undefined, 42]} frustumCulled={false}>
    <sphereGeometry args={[1, 5, 5]} /><meshBasicMaterial color="#c7e1dc" transparent opacity={0.55} />
  </instancedMesh>
}

const glassFragment = `
uniform float uTime;
varying vec2 vUv;
float hash(float n) { return fract(sin(n*127.1)*43758.5453); }
void main() {
  float column = floor(vUv.x * 90.);
  float seed = hash(column);
  float x = abs(fract(vUv.x * 90.) - (.2 + seed * .6));
  float y = fract(vUv.y + uTime * (.025 + seed * .035) + seed * 9.);
  float trail = (1. - smoothstep(.008,.036,x)) * smoothstep(.0,.4,y) * (1. - smoothstep(.72,.98,y));
  float droplet = (1. - smoothstep(.018,.08,x)) * (1. - smoothstep(.0,.025,abs(y-.38)));
  gl_FragColor = vec4(.71,.9,.9,(trail*.18+droplet*.32)*step(.55,seed));
}`

function GlassRain() {
  const front = useRef<ShaderMaterial>(null), side = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((_, delta) => { uniforms.uTime.value += safeDelta(delta) })
  return <group>
    <mesh position={[-2.89, 2.16, 0.679]}>
      <planeGeometry args={[2.95, 2.37]} />
      <shaderMaterial ref={front} uniforms={uniforms} vertexShader={rippleVertex} fragmentShader={glassFragment} transparent depthWrite={false} />
    </mesh>
    <mesh position={[2.23, 2.16, 0.679]}>
      <planeGeometry args={[2.97, 2.37]} />
      <shaderMaterial uniforms={uniforms} vertexShader={rippleVertex} fragmentShader={glassFragment} transparent depthWrite={false} />
    </mesh>
    <mesh position={[3.837, 2.16, -2.32]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[5.93, 2.37]} />
      <shaderMaterial ref={side} uniforms={uniforms} vertexShader={rippleVertex} fragmentShader={glassFragment} transparent depthWrite={false} />
    </mesh>
  </group>
}

export function Weather({ lowQuality }: { lowQuality: boolean }) {
  return <group><Rain lowQuality={lowQuality} /><Ripples /><EaveDrops /><GlassRain /></group>
}
