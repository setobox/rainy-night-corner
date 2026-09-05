import { useEffect, useMemo } from 'react'
import { Edges } from '@react-three/drei'
import { CanvasTexture, Color, DataTexture, LinearFilter, NearestFilter, RedFormat, SRGBColorSpace, Vector3 } from 'three'
import type { ThreeElements } from '@react-three/fiber'

export type Vec3 = [number, number, number]
const steps = new Uint8Array([95, 155, 210, 255])
export const toonGradient = new DataTexture(steps, 4, 1, RedFormat)
toonGradient.minFilter = NearestFilter
toonGradient.magFilter = NearestFilter
toonGradient.needsUpdate = true

type BoxProps = {
  position?: Vec3
  size: Vec3
  color?: string
  rotation?: Vec3
  glow?: number
  edges?: boolean
  metal?: boolean
}

export function Box({ position, size, color = '#e0d7bd', rotation, glow = 0, edges = false, metal = false }: BoxProps) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={size} />
    {metal
      ? <meshStandardMaterial color={color} roughness={0.36} metalness={0.4} />
      : <meshToonMaterial color={color} gradientMap={toonGradient} emissive={color} emissiveIntensity={glow} />}
    {edges && <Edges threshold={25} color="#1b2c3b" />}
  </mesh>
}

export function Cylinder({ position, radius = 0.06, height, color = '#56687a', rotation, top, glow = 0 }: {
  position?: Vec3; radius?: number; height: number; color?: string; rotation?: Vec3; top?: number; glow?: number
}) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <cylinderGeometry args={[top ?? radius, radius, height, 12]} />
    <meshToonMaterial color={color} gradientMap={toonGradient} emissive={color} emissiveIntensity={glow} />
  </mesh>
}

export function Rod({ from, to, radius = 0.025, color = '#607886' }: { from: Vec3; to: Vec3; radius?: number; color?: string }) {
  const { midpoint, length } = useMemo(() => {
    const a = new Vector3(...from), b = new Vector3(...to)
    const direction = b.clone().sub(a)
    return { midpoint: a.clone().add(b).multiplyScalar(0.5), length: direction.length() }
  }, [from, to])
  // Local Y is the cylinder's longitudinal axis.
  const direction = useMemo(() => new Vector3(...to).sub(new Vector3(...from)).normalize(), [from, to])
  return <mesh position={midpoint} onUpdate={mesh => mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction)} castShadow>
    <cylinderGeometry args={[radius, radius, length, 8]} />
    <meshToonMaterial color={color} gradientMap={toonGradient} />
  </mesh>
}

export function Glass({ position, size, rotation }: { position: Vec3; size: [number, number]; rotation?: Vec3 }) {
  return <mesh position={position} rotation={rotation}>
    <planeGeometry args={size} />
    <meshPhysicalMaterial color="#aedbdf" transparent opacity={0.10} roughness={0.08} metalness={0.05}
      side={2} depthWrite={false} />
  </mesh>
}

export function useCanvasTexture(draw: (context: CanvasRenderingContext2D, width: number, height: number) => void, width = 1024, height = 512) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D is required to draw scene textures')
    draw(context, width, height)
    const result = new CanvasTexture(canvas)
    result.colorSpace = SRGBColorSpace
    result.minFilter = LinearFilter
    result.anisotropy = 4
    return result
  }, [draw, width, height])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

export function Label({ text, subtext, position, size, color = '#234948', background = '#f3ebcc', rotation, glow = 0.25,
  border = false }: {
  text: string; subtext?: string; position: Vec3; size: [number, number]; color?: string; background?: string;
  rotation?: Vec3; glow?: number; border?: boolean
}) {
  const draw = useMemo(() => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = background; ctx.fillRect(0, 0, w, h)
    if (border) { ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.strokeRect(20, 20, w - 40, h - 40) }
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const font = '"Yu Gothic", "Meiryo", sans-serif'
    ctx.font = `700 ${Math.min(h * (subtext ? 0.48 : 0.62), w / (text.length * 0.92))}px ${font}`
    ctx.fillText(text, w / 2, h * (subtext ? 0.40 : 0.52))
    if (subtext) { ctx.font = `600 ${h * 0.14}px ${font}`; ctx.fillText(subtext, w / 2, h * 0.82) }
  }, [text, subtext, color, background, border])
  const texture = useCanvasTexture(draw, 1024, Math.max(128, Math.round(1024 * size[1] / size[0])))
  return <mesh position={position} rotation={rotation}>
    <planeGeometry args={size} />
    <meshBasicMaterial map={texture} color={new Color().setScalar(0.85 + glow * 0.25)} toneMapped={false} />
  </mesh>
}

export function Poster({ position, rotation, variant = 'food' }: { position: Vec3; rotation?: Vec3; variant?: 'food' | 'coffee' | 'notice' }) {
  const draw = useMemo(() => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const coffee = variant === 'coffee', notice = variant === 'notice'
    ctx.fillStyle = coffee ? '#314e48' : '#f6e7c6'; ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = coffee ? '#f8e5bb' : '#db714d'; ctx.fillRect(16, 16, w - 32, 125)
    ctx.fillStyle = coffee ? '#31574b' : '#fff8dc'; ctx.textAlign = 'center'
    ctx.font = 'bold 52px "Yu Gothic", sans-serif'; ctx.fillText(coffee ? '淹れたて' : notice ? 'まちの掲示板' : '秋のおいしい便り', w / 2, 95)
    if (coffee) {
      ctx.fillStyle = '#e9d6ad'; ctx.beginPath(); ctx.roundRect(120, 260, 220, 210, 22); ctx.fill()
      ctx.strokeStyle = '#e9d6ad'; ctx.lineWidth = 24; ctx.beginPath(); ctx.arc(345, 350, 65, -Math.PI / 2, Math.PI / 2); ctx.stroke()
      ctx.fillStyle = '#49392f'; ctx.beginPath(); ctx.ellipse(230, 264, 108, 25, 0, 0, Math.PI * 2); ctx.fill()
    } else if (!notice) {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#fffbed'; ctx.beginPath(); ctx.moveTo(115 + i * 125, 260); ctx.lineTo(50 + i * 125, 420); ctx.lineTo(180 + i * 125, 420); ctx.closePath(); ctx.fill()
        ctx.fillStyle = '#344a3a'; ctx.fillRect(85 + i * 125, 355, 65, 70)
      }
    } else {
      for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#abcfc3', '#e9bb79', '#f2f0d9', '#d2c5c1'][i]; ctx.fillRect(40 + (i % 2) * 240, 175 + Math.floor(i / 2) * 210, 190, 180) }
    }
    ctx.fillStyle = coffee ? '#f9e7be' : '#42594b'; ctx.font = 'bold 54px "Yu Gothic", sans-serif'; ctx.fillText(coffee ? 'COFFEE' : notice ? 'こよい町' : '手づくり おむすび', w / 2, 550)
    ctx.font = '36px sans-serif'; ctx.fillText(coffee ? '¥120' : notice ? '暮らしに、小さな灯り。' : '新発売  ¥128', w / 2, 620)
    ctx.fillStyle = '#6b8c73'; ctx.fillRect(24, 675, w - 48, 8)
  }, [variant])
  const texture = useCanvasTexture(draw, 512, 720)
  return <mesh position={position} rotation={rotation}>
    <planeGeometry args={[0.62, 0.87]} />
    <meshStandardMaterial map={texture} emissiveMap={texture} emissive="white" emissiveIntensity={0.25} roughness={0.8} />
  </mesh>
}

export function Torus({ position, radius, tube = 0.025, color = '#485763', rotation }: {
  position: Vec3; radius: number; tube?: number; color?: string; rotation?: Vec3
}) {
  return <mesh position={position} rotation={rotation} castShadow>
    <torusGeometry args={[radius, tube, 6, 28]} />
    <meshToonMaterial color={color} gradientMap={toonGradient} />
  </mesh>
}

export function GlowOrb(props: ThreeElements['mesh'] & { color?: string }) {
  const { color = '#fff0c7', ...rest } = props
  return <mesh {...rest}><sphereGeometry args={[0.07, 10, 8]} /><meshBasicMaterial color={new Color(color).multiplyScalar(2)} toneMapped={false} /></mesh>
}
