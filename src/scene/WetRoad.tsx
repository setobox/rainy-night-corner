import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import { HalfFloatType, Matrix4, Mesh, Plane, ShaderMaterial, Vector3, Vector4 } from 'three'
import { safeDelta } from './simulation'

const vertex = `
uniform mat4 uReflectionMatrix;
varying vec2 vUv;
varying vec4 vReflection;
void main() {
  vUv = uv;
  vReflection = uReflectionMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`

const fragment = `
uniform sampler2D uReflection;
uniform float uTime;
varying vec2 vUv;
varying vec4 vReflection;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
void main() {
  vec2 uv = vReflection.xy / vReflection.w;
  float pools = smoothstep(.3,.64,noise(vUv*9.)*.7+noise(vUv*23.)*.3);
  float wave = sin(vUv.y * 530. + uTime*1.1) * sin(vUv.x*83. + uTime*.5);
  uv.x += wave * .0013;
  uv.y += sin(vUv.y*210.+uTime)*.00055;
  vec3 reflected = texture2D(uReflection, uv).rgb * .28;
  reflected += texture2D(uReflection,uv+vec2(.0025,.001)).rgb*.18;
  reflected += texture2D(uReflection,uv-vec2(.0025,.001)).rgb*.18;
  reflected += texture2D(uReflection,uv+vec2(.006,.002)).rgb*.1;
  reflected += texture2D(uReflection,uv-vec2(.006,.002)).rgb*.1;
  reflected += texture2D(uReflection,uv+vec2(.009,.003)).rgb*.08;
  reflected += texture2D(uReflection,uv-vec2(.009,.003)).rgb*.08;
  float grain = hash(vUv*1800.);
  vec3 asphalt = vec3(.035,.061,.085) * (.78 + grain*.28);
  vec3 color = mix(asphalt, reflected, .12 + pools * .57);
  gl_FragColor = vec4(color,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

/** A single shared reflection pass, with clipping valid for an orthographic camera. */
export function WetRoad({ lowQuality }: { lowQuality: boolean }) {
  const { camera } = useThree()
  const road = useRef<Mesh>(null), material = useRef<ShaderMaterial>(null)
  const target = useFBO(lowQuality ? 256 : 768, lowQuality ? 256 : 768, { type: HalfFloatType })
  const reflectedCamera = useMemo(() => camera.clone(), [camera])
  const state = useMemo(() => ({ plane: new Plane(), normal: new Vector3(0, 1, 0), position: new Vector3(),
    look: new Vector3(), up: new Vector3(), clip: new Vector4(), corner: new Vector4(), inverse: new Matrix4() }), [])
  const uniforms = useMemo(() => ({ uReflection: { value: target.texture }, uReflectionMatrix: { value: new Matrix4() }, uTime: { value: 0 } }), [target.texture])
  useFrame(({ gl, scene }, delta) => {
    if (!road.current || !material.current) return
    uniforms.uTime.value += safeDelta(delta)
    road.current.updateWorldMatrix(true, false)
    const floor = -0.085
    reflectedCamera.position.copy(camera.position); reflectedCamera.position.y = 2 * floor - camera.position.y
    camera.getWorldDirection(state.look)
    state.look.add(camera.position); state.look.y = 2 * floor - state.look.y
    state.up.copy(camera.up); state.up.y *= -1
    reflectedCamera.up.copy(state.up)
    reflectedCamera.lookAt(state.look)
    reflectedCamera.updateMatrixWorld()
    reflectedCamera.projectionMatrix.copy(camera.projectionMatrix)

    uniforms.uReflectionMatrix.value.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1)
      .multiply(reflectedCamera.projectionMatrix).multiply(reflectedCamera.matrixWorldInverse).multiply(road.current.matrixWorld)

    state.position.set(0, floor + 0.008, 0)
    state.plane.setFromNormalAndCoplanarPoint(state.normal, state.position).applyMatrix4(reflectedCamera.matrixWorldInverse)
    state.clip.set(state.plane.normal.x, state.plane.normal.y, state.plane.normal.z, state.plane.constant)
    state.inverse.copy(reflectedCamera.projectionMatrix).invert()
    state.corner.set(Math.sign(state.clip.x), Math.sign(state.clip.y), 1, 1).applyMatrix4(state.inverse)
    state.clip.multiplyScalar(2 / state.clip.dot(state.corner))
    const projection = reflectedCamera.projectionMatrix.elements
    projection[2] = state.clip.x - projection[3]
    projection[6] = state.clip.y - projection[7]
    projection[10] = state.clip.z - projection[11]
    projection[14] = state.clip.w - projection[15]
    reflectedCamera.projectionMatrixInverse.copy(reflectedCamera.projectionMatrix).invert()

    const previousTarget = gl.getRenderTarget(), previousXr = gl.xr.enabled, previousShadow = gl.shadowMap.autoUpdate
    road.current.visible = false
    try {
      gl.xr.enabled = false; gl.shadowMap.autoUpdate = false
      gl.setRenderTarget(target); gl.clear(); gl.render(scene, reflectedCamera)
    } finally {
      road.current.visible = true; gl.xr.enabled = previousXr; gl.shadowMap.autoUpdate = previousShadow
      gl.setRenderTarget(previousTarget)
    }
  })
  return <mesh ref={road} position={[0, -0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[16, 16]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} />
  </mesh>
}
