import { Box, Label } from './primitives'
import { WetRoad } from './WetRoad'

export function Ground({ lowQuality }: { lowQuality: boolean }) {
  return <group>
    <Box position={[0, -0.61, 0]} size={[16, 0.95, 16]} color="#263c52" edges />
    <Box position={[0, -0.17, 0]} size={[16.08, 0.14, 16.08]} color="#526977" edges />
    <Box position={[0, -1.075, 0]} size={[15.7, 0.09, 15.7]} color="#1b3046" />
    <WetRoad lowQuality={lowQuality} />
    <Box position={[-0.55, 0.015, -2.25]} size={[10.5, 0.19, 8.38]} color="#79888a" edges />
    <Box position={[-0.55, 0.122, 1.54]} size={[10.45, 0.025, 0.69]} color="#9daba4" />
    {Array.from({ length: 21 }, (_, i) => <Box key={i} position={[-5.5 + i * 0.5, 0.14, 1.55]} size={[0.018, 0.008, 0.66]} color="#667d80" />)}
    {Array.from({ length: 17 }, (_, i) => <Box key={i} position={[4.35, 0.13, -6.1 + i * 0.48]} size={[0.66, 0.015, 0.015]} color="#667d80" />)}
    <Box position={[4.59, 0.045, -2.25]} size={[0.16, 0.23, 8.38]} color="#b4bbb0" />
    <Box position={[-0.55, 0.045, 1.96]} size={[10.45, 0.23, 0.16]} color="#b4bbb0" />
    {Array.from({ length: 6 }, (_, i) => <Box key={i} position={[3.1 + i * 0.66, -0.061, 4.05]} size={[0.38, 0.016, 2.56]} color="#bdc3b8" glow={0.07} />)}
    <Box position={[-3.67, -0.057, 6.47]} size={[5.35, 0.018, 0.065]} color="#b4bbae" />
    <Box position={[-3.67, -0.057, 3.13]} size={[5.35, 0.018, 0.065]} color="#b4bbae" />
    <Box position={[-6.31, -0.057, 4.8]} size={[0.065, 0.018, 3.39]} color="#b4bbae" />
    <Label text="P" position={[-4.6, -0.042, 4.8]} size={[0.65, 0.86]} rotation={[-Math.PI / 2, 0, 0]} color="#c4c7b2" background="#4e6371" glow={0} />
    {[-5.9, -3.6, -1.3, 1].map(x => <Box key={x} position={[x, -0.055, 7.2]} size={[1.1, 0.014, 0.055]} color="#c6ba8c" />)}
    {[-5, -1.5, 2].map(x => <group key={x} position={[x, -0.035, 2.13]}>
      <Box size={[1.1, 0.035, 0.25]} color="#213c4d" />
      {Array.from({ length: 12 }, (_, i) => <Box key={i} position={[-0.49 + i * 0.09, 0.028, 0]} size={[0.022, 0.018, 0.23]} color="#718b8a" />)}
    </group>)}
    <mesh position={[1.4, -0.058, 5.9]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.42, 32]} /><meshToonMaterial color="#344e5e" />
    </mesh>
    {[-0.2, -0.1, 0, 0.1, 0.2].map(v => <Box key={v} position={[1.4, -0.045, 5.9 + v]} size={[0.6, 0.009, 0.018]} color="#6c8588" />)}
    <Box position={[-5.52, -0.023, 4.8]} size={[0.17, 0.15, 1.45]} color="#a9b5aa" edges />
    <Box position={[-6.9, 0.11, -2.75]} size={[1.44, 0.3, 8.2]} color="#536773" edges />
    <Box position={[-6.94, 0.82, -6.65]} size={[1.5, 1.5, 0.18]} color="#728080" edges />
    {Array.from({ length: 4 }, (_, i) => <Box key={i} position={[-6.94, 0.34 + i * 0.32, -6.54]} size={[1.5, 0.017, 0.008]} color="#485f6a" />)}
  </group>
}
