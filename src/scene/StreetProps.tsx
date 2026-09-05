import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, Color, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { Box, Cylinder, GlowOrb, Label, Poster, Rod, Torus } from './primitives'
import type { Vec3 } from './primitives'
import { safeDelta, trafficPhase } from './simulation'

function VendingMachine() {
  return <group position={[-5.2, 0.14, 0.23]} rotation={[0, 0.09, 0]}>
    <Box position={[0, 1.34, 0]} size={[1.08, 2.58, 0.79]} color="#b65158" edges />
    <Box position={[0, 0.14, 0]} size={[1.12, 0.18, 0.82]} color="#394e5b" />
    <Box position={[-0.12, 1.72, 0.41]} size={[0.76, 1.29, 0.04]} color="#d5edf0" glow={0.8} />
    {[0, 1, 2].map(row => <group key={row}>
      <Box position={[-0.12, 1.18 + row * 0.41, 0.50]} size={[0.78, 0.043, 0.19]} color="#e8d7b5" glow={0.4} />
      {Array.from({ length: 5 }, (_, col) => <group key={col} position={[-0.43 + col * 0.15, 1.33 + row * 0.41, 0.48]}>
        <Cylinder radius={0.048} height={0.22} color={['#efda8d', '#bf686a', '#7da982', '#8bbeca', '#e7dabe'][(col + row) % 5]} />
        <Cylinder position={[0, 0.12, 0]} radius={0.028} height={0.035} color="#dce5d6" />
        <Box position={[0, -0.18, 0.091]} size={[0.065, 0.026, 0.012]} color="#8ef1c9" glow={2} />
      </group>)}
    </group>)}
    <Box position={[0, 0.54, 0.42]} size={[0.73, 0.23, 0.03]} color="#273e4c" edges />
    <Box position={[0.39, 1.28, 0.42]} size={[0.14, 0.53, 0.04]} color="#394c54" />
    <Box position={[0.39, 1.42, 0.45]} size={[0.095, 0.08, 0.01]} color="#a6d3a5" glow={1.4} />
    <Label text="つめた〜い" position={[-0.07, 2.45, 0.412]} size={[0.9, 0.18]} background="#b65158" color="#ffedcf" glow={0.9} />
    <Label text="DRINKS" position={[-0.05, 0.84, 0.411]} size={[0.73, 0.14]} background="#b65158" color="#ffedcf" />
    <pointLight position={[0, 1.7, 0.9]} color="#b9e8ee" intensity={0.8} distance={3} />
  </group>
}

function Bicycle() {
  const frame: [Vec3, Vec3][] = [
    [[-0.73, 0.45, 0], [-0.19, 0.49, 0]], [[-0.73, 0.45, 0], [-0.4, 1, 0]],
    [[-0.4, 1, 0], [-0.19, 0.49, 0]], [[-0.19, 0.49, 0], [0.38, 1.08, 0]],
    [[-0.4, 1, 0], [0.38, 1.08, 0]], [[0.38, 1.08, 0], [0.71, 0.45, 0]],
  ]
  return <group position={[4.31, 0.15, -1.27]} rotation={[0, Math.PI / 2, -0.06]} scale={0.95}>
    {[-0.73, 0.71].map(x => <group key={x}>
      <Torus position={[x, 0.45, 0]} radius={0.4} tube={0.04} color="#283c49" />
      <Torus position={[x, 0.45, 0]} radius={0.357} tube={0.015} color="#9facaa" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * Math.PI / 6
        return <Rod key={i} from={[x, 0.45, 0]} to={[x + Math.cos(a) * 0.36, 0.45 + Math.sin(a) * 0.36, 0]} radius={0.007} color="#a3b1b2" />
      })}
    </group>)}
    {frame.map(([from, to], i) => <Rod key={i} from={from} to={to} radius={0.032} color="#bc9274" />)}
    <Rod from={[-0.4, 0.92, 0]} to={[-0.43, 1.2, 0]} radius={0.024} />
    <Box position={[-0.46, 1.23, 0]} size={[0.29, 0.07, 0.18]} color="#37454c" />
    <Rod from={[0.36, 1.08, 0]} to={[0.3, 1.4, 0]} radius={0.025} />
    <Rod from={[0.3, 1.4, -0.22]} to={[0.3, 1.4, 0.22]} radius={0.02} color="#b5bfbb" />
    <Rod from={[0.3, 1.4, -0.22]} to={[0.12, 1.4, -0.22]} radius={0.028} color="#334754" />
    <Rod from={[0.3, 1.4, 0.22]} to={[0.12, 1.4, 0.22]} radius={0.028} color="#334754" />
    <Torus position={[-0.19, 0.49, 0.04]} radius={0.12} tube={0.012} color="#a6b0a7" />
    <Rod from={[-0.19, 0.49, 0.09]} to={[-0.04, 0.37, 0.12]} radius={0.02} />
    <Box position={[-0.02, 0.36, 0.17]} size={[0.12, 0.045, 0.16]} color="#283c49" />
    <Box position={[0.68, 1.11, 0]} size={[0.48, 0.045, 0.39]} color="#617881" />
    {[0, 1, 2].map(i => <group key={i}>
      <Box position={[0.68, 1.15 + i * 0.1, -0.19]} size={[0.48, 0.018, 0.017]} color="#7d9496" />
      <Box position={[0.68, 1.15 + i * 0.1, 0.19]} size={[0.48, 0.018, 0.017]} color="#7d9496" />
      <Box position={[0.915, 1.15 + i * 0.1, 0]} size={[0.017, 0.018, 0.38]} color="#7d9496" />
    </group>)}
    {Array.from({ length: 6 }, (_, i) => <Rod key={i} from={[0.45 + i * 0.088, 1.1, 0.19]} to={[0.45 + i * 0.088, 1.4, 0.19]} radius={0.008} />)}
    <Rod from={[-0.23, 0.45, 0]} to={[-0.41, 0.04, 0.19]} radius={0.019} />
  </group>
}

function Umbrellas() {
  return <group position={[1.23, 0.15, 1.17]}>
    <Box position={[0, 0.13, 0]} size={[0.72, 0.12, 0.4]} color="#516d70" edges />
    {[-0.33, 0.33].map(x => <Box key={x} position={[x, 0.36, 0]} size={[0.025, 0.53, 0.38]} color="#99ada5" />)}
    <Box position={[0, 0.56, 0]} size={[0.72, 0.035, 0.38]} color="#9aad9f" />
    {[-0.22, 0, 0.22].map((x, i) => <group key={x} position={[x, 0, 0]} rotation={[0, 0, (i - 1) * 0.09]}>
      <Cylinder position={[0, 0.67, 0]} radius={0.011} height={1.01} color="#c3d0c5" />
      <mesh position={[0, 0.59, 0]}><coneGeometry args={[0.075, 0.65, 8]} /><meshPhysicalMaterial color={i === 1 ? '#a7cfb8' : '#d5e0df'} transparent opacity={0.5} roughness={0.24} /></mesh>
      <mesh position={[0.045, 1.13, 0]}><torusGeometry args={[0.047, 0.012, 5, 12, Math.PI]} /><meshToonMaterial color="#b6c9c2" /></mesh>
    </group>)}
  </group>
}

function Rail({ position, length = 2.2, rotation = 0 }: { position: Vec3; length?: number; rotation?: number }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    {[-length / 2, length / 2].map(x => <group key={x}>
      <Cylinder position={[x, 0.47, 0]} radius={0.055} height={0.94} color="#a4b6ab" />
      <Cylinder position={[x, 0.08, 0]} radius={0.08} height={0.13} color="#425e6a" />
    </group>)}
    <Cylinder position={[0, 0.88, 0]} radius={0.045} height={length} rotation={[0, 0, Math.PI / 2]} color="#b2c1b0" />
    <Cylinder position={[0, 0.38, 0]} radius={0.03} height={length} rotation={[0, 0, Math.PI / 2]} color="#8fa69e" />
  </group>
}

function Lamp({ position, rotation = 0 }: { position: Vec3; rotation?: number }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <Cylinder position={[0, 0.16, 0]} radius={0.19} height={0.32} color="#3c5966" />
    <Cylinder position={[0, 2.68, 0]} radius={0.075} top={0.049} height={5.3} color="#365763" />
    <Rod from={[0, 5.28, 0]} to={[0.5, 5.46, 0]} radius={0.06} color="#557c7c" />
    <Box position={[0.68, 5.44, 0]} size={[0.74, 0.15, 0.38]} color="#365a62" edges />
    <Box position={[0.68, 5.351, 0]} size={[0.63, 0.035, 0.29]} color="#ffe8af" glow={2.6} />
    <pointLight position={[0.68, 5.1, 0]} color="#f4d6a0" intensity={17} distance={9} decay={2} />
    <Label text="こよい町" position={[0.075, 2.8, 0.088]} size={[0.31, 0.68]} background="#436f71" color="#ebdfb2" />
  </group>
}

function Cable({ points }: { points: Vec3[] }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map(p => new Vector3(...p))), [points])
  return <mesh><tubeGeometry args={[curve, 32, 0.019, 5, false]} /><meshToonMaterial color="#20394b" /></mesh>
}

function UtilityPole({ position, height = 7.6 }: { position: Vec3; height?: number }) {
  return <group position={position}>
    <Cylinder position={[0, height / 2, 0]} radius={0.14} top={0.095} height={height} color="#72807f" />
    <Cylinder position={[0, 0.52, 0]} radius={0.15} height={1.04} color="#374f5b" />
    {[0.3, 0.55, 0.8].map(y => <Cylinder key={y} position={[0, y, 0]} radius={0.154} height={0.09} color="#bdab70" />)}
    <Box position={[0, height - 0.57, 0]} size={[1.55, 0.09, 0.12]} color="#3a5565" />
    <Box position={[0, height - 1.27, 0]} size={[1.3, 0.075, 0.12]} color="#3a5565" />
    {[-0.61, 0, 0.61].map(x => <group key={x}>
      <Cylinder position={[x, height - 0.36, 0]} radius={0.067} height={0.34} color="#a9bdb4" />
      {[0, 0.07, 0.14].map(y => <Cylinder key={y} position={[x, height - 0.45 + y, 0]} radius={0.087} height={0.025} color="#cad2bd" />)}
    </group>)}
    <Cylinder position={[0.24, height - 1.48, 0.1]} radius={0.23} height={0.65} color="#92a6a0" />
    <Box position={[0.02, 3.08, 0.17]} size={[0.22, 0.79, 0.08]} color="#e3ddbc" />
    <Label text="夜" subtext="三丁目" position={[0.02, 3.09, 0.215]} size={[0.2, 0.59]} background="#e3ddbc" color="#4b776d" />
  </group>
}

function TrafficLight() {
  const red = useRef<Mesh>(null), amber = useRef<Mesh>(null), green = useRef<Mesh>(null), time = useRef(0)
  useFrame((_, delta) => {
    time.current += safeDelta(delta)
    const phase = trafficPhase(time.current)
    for (const [name, ref, color] of [['red', red, '#ef8177'], ['amber', amber, '#f2cf7b'], ['green', green, '#85d0b9']] as const) {
      if (ref.current) {
        const mat = ref.current.material as MeshStandardMaterial
        mat.emissive.set(color); mat.emissiveIntensity = phase === name ? 2.8 : 0
        mat.color.set(phase === name ? color : '#263d44')
      }
    }
  })
  return <group position={[6.66, 0, -5.76]}>
    <Cylinder position={[0, 2.53, 0]} radius={0.06} height={5.1} color="#52757c" />
    <Rod from={[0, 5.06, 0]} to={[-0.94, 5.06, 0]} radius={0.05} />
    <Box position={[-1.1, 5.05, 0]} size={[1.03, 0.36, 0.32]} color="#b1bda6" edges />
    {[red, amber, green].map((ref, i) => <mesh key={i} ref={ref} position={[-1.42 + i * 0.32, 5.05, 0.178]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} /><meshStandardMaterial color="#29434b" />
    </mesh>)}
  </group>
}

function AirConditioner({ position, rotation = 0 }: { position: Vec3; rotation?: number }) {
  return <group position={position} rotation={[0, rotation, 0]}>
    <Box position={[0, 0.5, 0]} size={[1.16, 0.79, 0.43]} color="#bbc5b5" edges />
    <Torus position={[-0.18, 0.5, 0.225]} radius={0.29} tube={0.025} color="#7a9695" />
    <Cylinder position={[-0.18, 0.5, 0.224]} radius={0.255} height={0.008} rotation={[Math.PI / 2, 0, 0]} color="#536e75" />
    {Array.from({ length: 9 }, (_, i) => <Rod key={i} from={[-0.43 + i * 0.063, 0.31, 0.238]} to={[-0.43 + i * 0.063, 0.69, 0.238]} radius={0.007} color="#a6b7ad" />)}
    {[0.3, 0.4, 0.5, 0.6, 0.7].map(y => <Box key={y} position={[0.37, y, 0.225]} size={[0.23, 0.025, 0.008]} color="#738e8d" />)}
    {[-0.4, 0.4].map(x => <Box key={x} position={[x, 0.07, 0]} size={[0.19, 0.13, 0.6]} color="#8d9d93" />)}
  </group>
}

function Plant({ position }: { position: Vec3 }) {
  return <group position={position}>
    <Cylinder position={[0, 0.15, 0]} radius={0.2} top={0.25} height={0.3} color="#8d7968" />
    {[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[Math.sin(i * 2.4) * 0.12, 0.37 + i * 0.04, Math.cos(i * 2.4) * 0.13]} rotation={[i * 0.4, i, 0.2]} scale={[0.13, 0.31, 0.1]}>
      <icosahedronGeometry args={[1, 0]} /><meshToonMaterial color={new Color(['#6d9b7f', '#87aa80', '#4e816d'][i % 3])} />
    </mesh>)}
  </group>
}

export function StreetProps() {
  return <group>
    <VendingMachine />
    <Bicycle />
    <Umbrellas />
    {[0, 1].map(i => <group key={i} position={[2.74 + i * 0.56, 0.14, 1.19]}>
      <Box position={[0, 0.47, 0]} size={[0.47, 0.88, 0.47]} color={i ? '#8ca29b' : '#a0b5a7'} edges />
      <Box position={[0, 0.93, 0]} size={[0.5, 0.08, 0.5]} color="#477974" />
      <Cylinder position={[0, 0.948, 0]} radius={0.113} height={0.035} color="#213f49" />
      <Label text={i ? 'びん・缶' : 'もえるごみ'} position={[0, 0.63, 0.242]} size={[0.36, 0.13]} background="#d7dfc5" color="#476e5e" />
    </group>)}
    <Lamp position={[-6.64, 0.15, 1.57]} />
    <Lamp position={[6.7, -0.08, 5.83]} rotation={Math.PI} />
    <UtilityPole position={[-6.65, 0.24, -5.3]} />
    <UtilityPole position={[6.52, -0.06, 0.05]} height={7.2} />
    {[-0.6, 0.02, 0.6].map((offset, i) => <Cable key={i} points={[[-6.65 + offset, 7.55, -5.3], [-0.2 + offset, 6.44, -2.7], [6.52 + offset, 6.98, 0.05]]} />)}
    <Cable points={[[-6.65, 6.6, -5.3], [-4.8, 5.9, -3.5], [-4.45, 4.5, -2.2]]} />
    <Rail position={[-3.88, 0.14, 1.9]} length={2.1} />
    <Rail position={[4.61, 0.15, -3.7]} rotation={Math.PI / 2} length={2.6} />
    <Rail position={[1.02, -0.06, 7.6]} length={2.5} />
    <TrafficLight />
    <AirConditioner position={[-4.98, 0.13, -3.13]} rotation={-Math.PI / 2} />
    <AirConditioner position={[2.42, 0.13, -5.98]} rotation={Math.PI} />
    <group position={[-5.28, 0.15, -1.2]}>
      <Box position={[0, 1.35, 0]} size={[0.96, 1.2, 0.12]} color="#766f5d" edges />
      <Poster position={[0, 1.38, 0.068]} variant="notice" />
      {[-0.38, 0.38].map(x => <Box key={x} position={[x, 0.65, 0]} size={[0.05, 1.3, 0.07]} color="#5c6b62" />)}
      <Box position={[0, 1.99, 0]} size={[1.08, 0.07, 0.31]} color="#46615e" />
    </group>
    <group position={[6.5, 0, 0.06]}>
      <Label text="こよい町三丁目" position={[0, 3.66, 0.15]} size={[1.48, 0.33]} color="#dcead1" background="#487f79" border />
      <mesh position={[0, 2.78, 0.2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.37, 0.37, 0.04, 32]} /><meshToonMaterial color="#bd655f" /></mesh>
      <Box position={[0, 2.78, 0.232]} size={[0.53, 0.11, 0.01]} color="#ede3c4" />
    </group>
    <Plant position={[-4.08, 0.16, 1.12]} />
    <Plant position={[4.26, 0.13, -5.18]} />
    <GlowOrb position={[-5.65, 2.84, -1.2]} />
  </group>
}
