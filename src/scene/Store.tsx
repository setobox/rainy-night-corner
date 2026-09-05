import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, MeshToonMaterial } from 'three'
import { Box, Cylinder, Glass, Label, Poster } from './primitives'
import { Interior } from './Interior'
import { doorOpening, safeDelta } from './simulation'

function Doors() {
  const left = useRef<Group>(null), right = useRef<Group>(null), elapsed = useRef(0)
  useFrame((_, delta) => {
    elapsed.current += safeDelta(delta)
    const opening = doorOpening(elapsed.current) * 0.78
    if (left.current) left.current.position.x = -0.69 - opening
    if (right.current) right.current.position.x = 0.13 + opening
  })
  return <group position={[0, 0, 0.68]}>
    {[-1, 1].map(side => <group key={side} ref={side === -1 ? left : right} position={[side === -1 ? -0.69 : 0.13, 0, 0]}>
      <Glass position={[0, 1.81, 0]} size={[0.78, 2.96]} />
      {[-0.4, 0.4].map(x => <Box key={x} position={[x, 1.81, 0.015]} size={[0.04, 2.97, 0.06]} color="#507b78" metal />)}
      {[0.34, 3.29].map(y => <Box key={y} position={[0, y, 0]} size={[0.83, 0.055, 0.07]} color="#6f9690" />)}
      <Box position={[0, 1.33, 0.018]} size={[0.78, 0.16, 0.015]} color="#5baa91" glow={0.25} />
      <Box position={[0, 1.43, 0.02]} size={[0.78, 0.026, 0.015]} color="#e8d98f" />
      <Label text="自動" position={[side * -0.26, 1.89, 0.043]} size={[0.16, 0.13]} background="#eeeee0" color="#4c7468" />
      <Label text="いらっしゃいませ" position={[0, 2.66, 0.02]} size={[0.7, 0.12]} background="#edf0db" color="#4a8973" />
    </group>)}
    <Box position={[-0.28, 3.38, 0]} size={[1.9, 0.16, 0.21]} color="#486d69" />
    <Box position={[-0.28, 3.38, 0.12]} size={[0.19, 0.06, 0.025]} color="#182c30" />
  </group>
}

function SignBand() {
  const light = useRef<Mesh>(null), time = useRef(0)
  useFrame((_, delta) => {
    time.current += safeDelta(delta)
    if (light.current) {
      const phase = time.current % 17
      ;(light.current.material as MeshToonMaterial).emissiveIntensity = phase > 15.7 && phase < 15.88 ? 0.85 : 1.5
    }
  })
  return <group>
    <Box position={[-0.35, 4.18, 0.82]} size={[8.8, 0.84, 0.22]} color="#e2dec2" edges />
    <Box position={[-0.35, 4.58, 0.965]} size={[8.78, 0.09, 0.035]} color="#396f61" glow={0.25} />
    <Box position={[-0.35, 3.81, 0.97]} size={[8.78, 0.13, 0.035]} color="#287c70" glow={0.5} />
    <Box position={[-0.35, 3.91, 0.973]} size={[8.78, 0.055, 0.035]} color="#e6bf73" glow={0.6} />
    <mesh ref={light} position={[-0.35, 4.25, 0.946]}>
      <boxGeometry args={[8.68, 0.57, 0.04]} />
      <meshToonMaterial color="#c9e8d6" emissive="#b7e0c7" emissiveIntensity={1.5} />
    </mesh>
    <Label text="こよいマート" subtext="KOYOI MART  ·  あなたの街の、あたたかな灯り。" position={[-0.35, 4.24, 0.975]} size={[4.65, 0.57]} background="#cce3ca" color="#286756" glow={0.8} />
    <Label text="24" subtext="OPEN" position={[3.34, 4.26, 0.976]} size={[0.51, 0.52]} color="#336f60" background="#cce3ca" glow={0.8} />
    <Cylinder position={[-3.82, 4.25, 0.983]} radius={0.2} height={0.025} color="#32866c" rotation={[Math.PI / 2, 0, 0]} glow={0.6} />
    <Cylinder position={[-3.74, 4.32, 1.002]} radius={0.15} height={0.026} color="#d7e7c5" rotation={[Math.PI / 2, 0, 0]} glow={0.8} />
    <Box position={[3.91, 4.18, -2.3]} size={[0.22, 0.84, 6.05]} color="#dce0c4" edges />
    <Box position={[4.04, 3.81, -2.3]} size={[0.04, 0.13, 6.05]} color="#287c70" glow={0.5} />
    <Box position={[4.045, 3.91, -2.3]} size={[0.035, 0.055, 6.05]} color="#e6bf73" glow={0.5} />
    <Label text="こよいマート" subtext="KOYOI MART · OPEN 24 HOURS" position={[4.04, 4.25, -2.1]} size={[3.7, 0.53]} rotation={[0, Math.PI / 2, 0]} color="#286756" background="#cce3ca" glow={0.7} />
  </group>
}

export function Store() {
  return <group>
    <Box position={[-0.35, 0.14, -2.3]} size={[8.6, 0.26, 6.2]} color="#6c8179" edges />
    <Box position={[-0.35, 2.46, -5.3]} size={[8.3, 4.46, 0.18]} color="#b5b7a1" edges />
    <Box position={[-4.45, 2.46, -2.3]} size={[0.18, 4.46, 6.1]} color="#b1b7a4" edges />
    <Box position={[-4.552, 0.68, -2.3]} size={[0.026, 0.69, 6.03]} color="#8b9e99" />
    <Box position={[-0.35, 0.68, -5.402]} size={[8.25, 0.69, 0.026]} color="#8b9e99" />
    <Box position={[-1.1, 1.63, -5.425]} size={[1.38, 2.57, 0.035]} color="#728b87" edges />
    <Label text="搬入口" position={[-1.1, 2.55, -5.45]} rotation={[0, Math.PI, 0]} size={[0.57, 0.19]} background="#c7cdb6" color="#4a675e" />
    <Cylinder position={[-1.6, 1.6, -5.48]} radius={0.026} height={0.24} color="#b1c0ac" />
    <Cylinder position={[1.36, 2.21, -5.47]} radius={0.047} height={3.71} color="#879f99" />
    <Box position={[1.89, 2.19, -5.53]} size={[0.53, 0.79, 0.21]} color="#829690" edges />
    {Array.from({ length: 5 }, (_, i) => <Box key={i} position={[1.89, 1.95 + i * 0.09, -5.643]} size={[0.37, 0.023, 0.009]} color="#4f6b71" />)}
    <Interior />
    <Box position={[-0.35, 4.72, -2.3]} size={[8.75, 0.25, 6.45]} color="#617779" edges />
    <Box position={[-0.35, 4.875, -2.3]} size={[8.9, 0.075, 6.58]} color="#829496" edges />
    <Box position={[-0.35, 4.93, -2.3]} size={[8.54, 0.045, 6.2]} color="#687b83" />
    {[-4.38, 3.68].map(x => <Box key={x} position={[x, 4.97, -2.3]} size={[0.09, 0.17, 6.22]} color="#9bacaa" />)}
    {[-5.36, 0.77].map(z => <Box key={z} position={[-0.35, 4.97, z]} size={[8.16, 0.17, 0.09]} color="#9bacaa" />)}
    {Array.from({ length: 10 }, (_, i) => <Box key={i} position={[-4.08 + i * 0.82, 4.956, -2.3]} size={[0.018, 0.012, 6.02]} color="#809194" />)}
    <Box position={[-2.6, 5.09, -3.8]} size={[1.5, 0.23, 0.85]} color="#8fa19e" edges />
    {Array.from({ length: 8 }, (_, i) => <Box key={i} position={[-3.22 + i * 0.17, 5.22, -3.8]} size={[0.045, 0.014, 0.7]} color="#526975" />)}
    <SignBand />
    <Box position={[-0.35, 3.72, 0.77]} size={[8.8, 0.13, 1.1]} color="#356c65" edges />
    <Box position={[-0.35, 3.64, 1.13]} size={[8.35, 0.025, 0.16]} color="#ffe5ae" glow={2} />
    <Box position={[-0.35, 3.69, 1.32]} size={[8.83, 0.1, 0.075]} color="#5b8880" />
    <Box position={[-2.91, 0.64, 0.59]} size={[3.04, 0.67, 0.16]} color="#a6bcaa" edges />
    <Box position={[2.17, 0.64, 0.59]} size={[3.02, 0.67, 0.16]} color="#a6bcaa" edges />
    <Box position={[3.79, 0.64, -2.3]} size={[0.15, 0.67, 5.95]} color="#a6bcaa" edges />
    {[-4.38, -2.88, -1.37, 0.7, 2.26, 3.76].map(x => <Box key={x} position={[x, 2.02, 0.6]} size={[0.08, 3.37, 0.17]} color="#47736e" metal />)}
    <Box position={[-2.88, 3.44, 0.6]} size={[3.07, 0.07, 0.16]} color="#5d8880" />
    <Box position={[2.23, 3.44, 0.6]} size={[3.08, 0.07, 0.16]} color="#5d8880" />
    {[-3.62, -2.12, 1.49, 3.01].map(x => <Glass key={x} position={[x, 2.18, 0.63]} size={[1.43, 2.4]} />)}
    {[-4.65, -3.15, -1.65, -0.15].map(z => <group key={z}>
      <Box position={[3.79, 2.06, z - 0.73]} size={[0.14, 3.2, 0.06]} color="#47736e" metal />
      <Glass position={[3.82, 2.18, z]} size={[1.4, 2.4]} rotation={[0, Math.PI / 2, 0]} />
    </group>)}
    <Box position={[3.79, 3.44, -2.3]} size={[0.16, 0.07, 5.96]} color="#5d8880" />
    <Doors />
    <Box position={[-0.29, 0.32, 1.07]} size={[1.91, 0.06, 0.81]} color="#354f50" />
    <Label text="WELCOME" position={[-0.29, 0.355, 1.07]} size={[1.15, 0.25]} rotation={[-Math.PI / 2, 0, 0]} color="#b7bda1" background="#354f50" />
    <Poster position={[-2.97, 2.13, 0.663]} variant="food" />
    <Poster position={[3.82, 2.23, -0.65]} rotation={[0, Math.PI / 2, 0]} variant="coffee" />
    <Label text="ATM" position={[3.02, 3.08, 0.66]} size={[0.53, 0.25]} background="#bc765a" color="#fff2cb" />
    <Label text="たばこ・お酒" position={[-3.65, 3.09, 0.66]} size={[0.94, 0.19]} background="#e7e3c6" color="#608b77" />
    <Cylinder position={[-4.57, 1.92, 0.98]} radius={0.055} height={3.4} color="#426e72" />
    <Cylinder position={[-4.57, 3.65, 1.12]} radius={0.06} height={0.29} rotation={[Math.PI / 2, 0, 0]} color="#426e72" />
    <pointLight position={[-0.3, 3.2, 1.7]} color="#c2f4d1" intensity={9} distance={7} />
  </group>
}
