import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')
if (!canvas) throw new Error('Canvas not found')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (
			child instanceof THREE.Mesh &&
			child.material instanceof THREE.MeshStandardMaterial
		) {
			child.material.envMapIntensity = 2.5
			child.material.needsUpdate = true
			child.castShadow = true
			child.receiveShadow = true
		}
	})
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.jpg',
	'/textures/environmentMaps/0/nx.jpg',
	'/textures/environmentMaps/0/py.jpg',
	'/textures/environmentMaps/0/ny.jpg',
	'/textures/environmentMaps/0/pz.jpg',
	'/textures/environmentMaps/0/nz.jpg',
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
	gltf.scene.scale.set(2, 2, 2)
	gltf.scene.rotation.y = Math.PI * 0.5
	scene.add(gltf.scene)

	updateAllMaterials()
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	effectComposer.setSize(sizes.width, sizes.height)
	effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Postprocessing
 */

// Render target
const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
	samples: renderer.getPixelRatio() === 1 ? 2 : 0,
})

const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

gui.add(dotScreenPass, 'enabled').name('Dot Screen')

const glitchPass = new GlitchPass()
glitchPass.enabled = false
glitchPass.goWild = false
effectComposer.addPass(glitchPass)

gui.add(glitchPass, 'enabled').name('Glitch')
gui.add(glitchPass, 'goWild').name('Go Wild')

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

gui.add(rgbShiftPass, 'enabled').name('RGB Shift')

gui
	.add(rgbShiftPass.uniforms.amount, 'value')
	.min(0)
	.max(0.1)
	.step(0.0001)
	.name('RGB Shift Amount')
gui
	.add(rgbShiftPass.uniforms.angle, 'value')
	.min(0)
	.max(2 * Math.PI)
	.step(0.0001)
	.name('RGB Shift Angle')

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

const unrealBloomPass = new UnrealBloomPass(
	new THREE.Vector2(sizes.width, sizes.height),
	1.5,
	0.4,
	0.85
)
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)

gui.add(unrealBloomPass, 'enabled').name('Unreal Bloom')
gui
	.add(unrealBloomPass, 'strength')
	.min(0)
	.max(2)
	.step(0.001)
	.name('Unreal Bloom Strength')

gui
	.add(unrealBloomPass, 'radius')
	.min(0)
	.max(2)
	.step(0.001)
	.name('Unreal Bloom Radius')

gui
	.add(unrealBloomPass, 'threshold')
	.min(0)
	.max(1)
	.step(0.001)
	.name('Unreal Bloom Threshold')

// Tint pass
const tintShader = {
	uniforms: {
		tDiffuse: { value: null },
		uTint: { value: null },
	},
	vertexShader: /*glsl*/ `

	varying vec2 vUv;

	void main() {
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			vUv = uv;
		}
	`,
	fragmentShader: /*glsl*/ `

	uniform sampler2D tDiffuse;
		varying vec2 vUv;
		uniform vec3 uTint;

		void main(){
			vec4 color = texture2D(tDiffuse, vUv);
			color.rgb += uTint;
			gl_FragColor = color;
		}
	`,
}

const tintPass = new ShaderPass(tintShader)
tintPass.enabled = false
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)

gui.add(tintPass, 'enabled').name('Tint')
gui
	.add(tintPass.material.uniforms.uTint.value, 'x', -1, 1, 0.01)
	.name('Red tint')
gui
	.add(tintPass.material.uniforms.uTint.value, 'y', -1, 1, 0.01)
	.name('Green tint')
gui
	.add(tintPass.material.uniforms.uTint.value, 'z', -1, 1, 0.01)
	.name('Blue tint')

const displacementShader = {
	uniforms: {
		tDiffuse: { value: null },
		uNormalMap: {
			value: textureLoader.load('/textures/interfaceNormalMap.png'),
		},
	},
	vertexShader: /*glsl*/ `
		varying vec2 vUv;

		void main() { 

			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

			vUv = uv;
		}
	`,
	fragmentShader: /*glsl*/ `
		uniform sampler2D tDiffuse;
		uniform sampler2D uNormalMap;

		varying vec2 vUv;

		void main(){ 

			vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
			vec2 newUv = vUv + normalColor.xy * 0.1;
			vec4 color = texture2D(tDiffuse, newUv);

			vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
			float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
			color.rgb += lightness * 2.0;
			gl_FragColor = color;
		}
	`,
}

const displacementPass = new ShaderPass(displacementShader)
displacementPass.enabled = true
effectComposer.addPass(displacementPass)

if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
	const smaaPass = new SMAAPass(sizes.width, sizes.height)
	effectComposer.addPass(smaaPass)

	gui.add(smaaPass, 'enabled').name('SMAA')
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update controls
	controls.update()

	// Render
	// renderer.render(scene, camera)
	effectComposer.render()

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
