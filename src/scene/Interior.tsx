import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, InstancedMesh, Object3D, Shape } from 'three'
import { Box, Cylinder, Glass, Label, Poster, toonGradient } from './primitives'
import type { Vec3 } from './primitives'
import { seededRandom } from './simulation'

type Item = { position: Vec3; scale: Vec3; color: string }
const goodsColors = ['#ee9864', '#83b788', '#f3d97f', '#c67375', '#c4d8c9', '#eee7c9', '#82baca', '#ba996c']

function PreparedFood() {
  const riceShape = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-0.095, 0); shape.lineTo(0, 0.18); shape.lineTo(0.095, 0); shape.closePath()
    return shape
  }, [])
  return <group>
    {Array.from({ length: 8 }, (_, i) => <group key={i} position={[-1.03 + i * 0.29, 1.407, 0.21]}>
      <mesh castShadow>
        <extrudeGeometry args={[riceShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.007, bevelSize: 0.007, bevelSegments: 1, steps: 1 }]} />
        <meshToonMaterial color="#efe7cb" gradientMap={toonGradient} emissive="#eed5a3" emissiveIntensity={0.18} />
      </mesh>
      <Box position={[0, 0.035, 0.095]} size={[0.075, 0.075, 0.012]} color="#3d5642" />
      <Box position={[0, 0.12, 0.094]} size={[0.035, 0.019, 0.013]} color={i % 2 ? '#bc7165' : '#8c9d64'} />
    </group>)}
    {Array.from({ length: 6 }, (_, i) => <group key={i} position={[-1.01 + i * 0.4, 1.93, 0]}>
      <Box size={[0.33, 0.07, 0.5]} color="#3d5953" />
      <Box position={[-0.06, 0.05, 0]} size={[0.14, 0.06, 0.4]} color="#f3e5c5" glow={0.18} />
      <Cylinder position={[-0.06, 0.085, 0]} radius={0.025} height={0.01} color="#b35e59" />
      <Box position={[0.086, 0.05, 0.11]} size={[0.1, 0.06, 0.16]} color="#b98555" />
      <Box position={[0.086, 0.05, -0.1]} size={[0.1, 0.06, 0.14]} color="#829e62" />
    </group>)}
  </group>
}

function Items({ items, bottles = false }: { items: Item[]; bottles?: boolean }) {
  const ref = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!ref.current) return
    const dummy = new Object3D()
    items.forEach((item, i) => {
      dummy.position.set(...item.position); dummy.scale.set(...item.scale); dummy.updateMatrix()
      ref.current!.setMatrixAt(i, dummy.matrix)
      ref.current!.setColorAt(i, new Color(item.color))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [items])
  return <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow>
    {bottles ? <cylinderGeometry args={[0.36, 0.46, 1, 8]} /> : <boxGeometry args={[1, 1, 1]} />}
    <meshToonMaterial color="white" gradientMap={toonGradient} emissive="#c4a275" emissiveIntensity={0.28} />
  </instancedMesh>
}

function Shelf({ position, length = 2.6, rotation = 0, seed = 4 }: { position: Vec3; length?: number; rotation?: number; seed?: number }) {
  const items = useMemo(() => {
    const random = seededRandom(seed), result: Item[] = []
    for (let level = 0; level < (seed === 8 ? 2 : 3); level++) {
      for (let col = 0; col < 11; col++) {
        for (const side of [-1, 1]) {
          const height = 0.20 + random() * 0.15
          result.push({ position: [-length / 2 + 0.17 + col * (length - 0.34) / 10, 0.44 + level * 0.48 + height / 2, side * 0.24],
            scale: [0.15 + random() * 0.035, height, 0.19], color: goodsColors[Math.floor(random() * goodsColors.length)] })
        }
      }
    }
    return result
  }, [length, seed])
  return <group position={position} rotation={[0, rotation, 0]}>
    <Box position={[0, 0.2, 0]} size={[length, 0.3, 0.8]} color="#9cac9c" />
    <Box position={[0, 1.05, 0]} size={[length, 1.5, 0.06]} color="#c4c5a6" />
    {[-length / 2, length / 2].map(x => <Box key={x} position={[x, 1.01, 0]} size={[0.045, 1.7, 0.75]} color="#dbd7bc" />)}
    {[0.4, 0.88, 1.36, 1.84].map(y => <group key={y}>
      <Box position={[0, y, 0]} size={[length, 0.065, 0.8]} color="#ebdfb8" glow={0.18} />
      <Box position={[0, y, 0.406]} size={[length, 0.085, 0.015]} color="#e9b86c" />
      {Array.from({ length: 9 }, (_, i) => <Box key={i} position={[-length / 2 + 0.2 + i * (length - 0.4) / 8, y, 0.418]} size={[0.12, 0.048, 0.008]} color="#ffefc8" glow={0.3} />)}
    </group>)}
    <Items items={items} />
    {seed === 8 && <PreparedFood />}
    <Label text={seed === 4 ? 'お菓子・スナック' : 'お弁当・おむすび'} position={[0, 1.98, 0.06]} size={[length * 0.7, 0.2]} color="#3c6552" glow={0.45} />
  </group>
}

function Fridges() {
  const bottles = useMemo(() => {
    const items: Item[] = []
    for (let bay = 0; bay < 4; bay++) for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) {
      items.push({ position: [-3.4 + bay * 1.23 + col * 0.205, 0.78 + row * 0.51, -4.63], scale: [0.155, 0.32, 0.155], color: goodsColors[(bay * 3 + col + row) % goodsColors.length] })
    }
    return items
  }, [])
  return <group>
    <Box position={[-1.2, 1.83, -4.98]} size={[5.15, 3.0, 0.62]} color="#465e60" edges />
    <Box position={[-1.2, 1.78, -4.64]} size={[4.94, 2.72, 0.05]} color="#cce3cd" glow={0.65} />
    {[0, 1, 2, 3].map(i => <group key={i}>
      <Box position={[-3.75 + i * 1.25, 1.8, -4.34]} size={[0.055, 2.8, 0.14]} color="#647e7a" />
      <Box position={[-2.64 + i * 1.25, 1.6, -4.22]} size={[0.035, 0.7, 0.045]} color="#2a4a4b" />
      <Glass position={[-3.16 + i * 1.25, 1.8, -4.29]} size={[1.15, 2.7]} />
    </group>)}
    {[0.57, 1.08, 1.59, 2.1, 2.66].map(y => <Box key={y} position={[-1.2, y, -4.42]} size={[4.98, 0.045, 0.46]} color="#e1e0c6" glow={0.35} />)}
    <Items items={bottles} bottles />
    <Label text="つめたい飲みもの" subtext="COLD DRINKS · FRESH EVERY DAY" position={[-1.2, 3.17, -4.62]} size={[4.9, 0.27]} color="#407866" glow={0.6} />
  </group>
}

function Counter() {
  return <group position={[1.77, 0.3, -0.34]}>
    <Box position={[0, 0.61, 0]} size={[2.65, 1.14, 0.94]} color="#d9ba84" edges />
    <Box position={[0, 1.2, 0]} size={[2.8, 0.12, 1.04]} color="#ebe1bf" />
    <Box position={[0, 0.33, 0.485]} size={[2.64, 0.11, 0.02]} color="#387e6b" />
    <Label text="こよいマート" position={[0, 0.75, 0.483]} size={[1.55, 0.3]} background="#d9ba84" color="#477357" />
    <Box position={[-0.32, 1.35, -0.05]} size={[0.43, 0.12, 0.37]} color="#40565b" />
    <Box position={[-0.32, 1.64, -0.12]} size={[0.48, 0.34, 0.1]} rotation={[-0.12, 0, 0]} color="#30454f" edges />
    <Label text="¥ 680" position={[-0.32, 1.65, -0.054]} size={[0.38, 0.2]} background="#9fbba0" color="#355c4c" glow={0.7} />
    <Box position={[1, 1.59, -0.04]} size={[0.48, 0.69, 0.54]} color="#384745" edges />
    <Box position={[1, 1.56, 0.248]} size={[0.32, 0.25, 0.05]} color="#1d2d33" />
    <Cylinder position={[0.91, 1.43, 0.29]} height={0.17} radius={0.062} color="#f2dec1" />
    <Cylinder position={[1.1, 1.43, 0.29]} height={0.17} radius={0.062} color="#f2dec1" />
    <Label text="COFFEE" position={[1, 1.86, 0.24]} size={[0.38, 0.1]} glow={0.6} />
    <Box position={[-1.02, 1.34, 0.04]} size={[0.56, 0.19, 0.64]} color="#71877b" />
    <Box position={[-1.02, 1.46, 0.04]} size={[0.49, 0.045, 0.56]} color="#8a673a" />
    {[-1.17, -0.92].map(x => [-0.12, 0.1, 0.23].map(z => <Cylinder key={`${x}${z}`} position={[x, 1.51, z]} height={0.07} radius={0.075} color="#e3c487" />))}
    <Glass position={[-1.02, 1.66, 0.37]} size={[0.6, 0.39]} />
    <Label text="おでん" position={[-1.02, 1.29, 0.375]} size={[0.46, 0.11]} background="#b46945" color="#fff1c2" />
  </group>
}

export function Interior() {
  return <group>
    <Box position={[-0.35, 0.26, -2.3]} size={[8.05, 0.12, 5.85]} color="#ded5b3" glow={0.25} />
    {Array.from({ length: 12 }, (_, i) => <Box key={`x${i}`} position={[-4.25 + i * 0.7, 0.324, -2.3]} size={[0.014, 0.006, 5.84]} color="#b5b5a0" />)}
    {Array.from({ length: 9 }, (_, i) => <Box key={`z${i}`} position={[-0.35, 0.326, -5.1 + i * 0.65]} size={[8, 0.006, 0.014]} color="#b5b5a0" />)}
    <Fridges />
    <Shelf position={[-2.15, 0.32, -1.75]} length={2.6} seed={4} />
    <Shelf position={[0.1, 0.32, -2.85]} length={2.6} seed={8} />
    <Counter />
    <Box position={[2.65, 1.53, -5.13]} size={[1.3, 2.48, 0.14]} color="#99a89a" edges />
    <Label text="STAFF ONLY" position={[2.65, 2.03, -5.047]} size={[0.8, 0.16]} color="#586c5e" />
    <Cylinder position={[3.07, 1.46, -5.02]} radius={0.045} height={0.25} color="#d9d7b8" />
    <Box position={[2.8, 0.84, -3.38]} size={[1.1, 1, 1.65]} color="#d5dfcd" edges />
    <Box position={[2.8, 1.37, -3.38]} size={[1.12, 0.1, 1.68]} color="#82aba1" />
    <Label text="アイス" position={[2.8, 0.99, -2.545]} size={[0.7, 0.2]} />
    <group position={[-3.6, 0.3, 0]}>
      <Box position={[0, 0.48, 0]} size={[0.8, 0.95, 0.37]} color="#596e62" />
      {[0.47, 0.82, 1.17].map((y, row) => <group key={y}>
        <Box position={[0, y, 0.12]} size={[0.85, 0.08, 0.42]} color="#c2c4a5" />
        {[-0.27, 0, 0.27].map((x, i) => <Box key={x} position={[x, y + 0.18, 0.06]} rotation={[-0.18, 0, 0]} size={[0.22, 0.34, 0.04]} color={goodsColors[row * 2 + i]} glow={0.2} />)}
      </group>)}
      <Label text="MAGAZINE" position={[0, 1.53, 0.08]} size={[0.83, 0.13]} />
    </group>
    <Poster position={[-4.33, 2.56, -2.32]} rotation={[0, Math.PI / 2, 0]} variant="food" />
    <Poster position={[-4.33, 2.56, -3.32]} rotation={[0, Math.PI / 2, 0]} variant="coffee" />
    <Label text="お会計 →" position={[-0.48, 0.334, -0.5]} size={[0.76, 0.26]} rotation={[-Math.PI / 2, 0, 0]} color="#eeead4" background="#659982" />
    {[-3.3, -0.4, 2.3].map(x => [-3.3, -0.9].map(z => <Box key={`${x}${z}`} position={[x, 3.96, z]} size={[1.75, 0.05, 0.25]} color="#fff0c1" glow={2} />))}
    <pointLight position={[-2, 3.55, -1.35]} color="#ffdd9b" intensity={4.5} distance={8} decay={2} />
    <pointLight position={[2, 3.55, -2.25]} color="#ffdfac" intensity={4} distance={7} decay={2} />
  </group>
}
