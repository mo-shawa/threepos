import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import waterFragmentShader from './shaders/water/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'

/**
 * Base
 */
// Debug
const debug = new GUI({ width: 340 })
const debugObject = {
	depthColor: '#186691',
	surfaceColor: '#9bd8ff',
}

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')
if (!canvas) throw new Error('Canvas not found')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
	vertexShader: waterVertexShader,
	fragmentShader: waterFragmentShader,
	uniforms: {
		uTime: { value: 0 },

		uBigWavesElevation: { value: 0.1 },
		uBigWavesFrequency: { value: new THREE.Vector2(4, 1.25) },
		uBigWavesSpeed: { value: 0.75 },

		uSmallWavesElevation: { value: 0.15 },
		uSmallWavesFrequency: { value: 3 },
		uSmallWavesSpeed: { value: 0.2 },
		uSmallWavesIterations: { value: 4.0 },

		uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
		uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
		uColorOffset: { value: 0.18 },
		uColorMultiplier: { value: 2.5 },
	},
})

debug
	.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 2, 0.001)
	.name('small wave elevation')

debug
	.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 20, 0.001)
	.name('small wave frequency')

debug
	.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 10, 0.001)
	.name('small wave speed')

debug
	.add(waterMaterial.uniforms.uSmallWavesIterations, 'value', 0, 10, 1)
	.name('small wave iterations')

debug
	.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0, 1, 0.001)
	.name('big wave elevation')

debug
	.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0, 10, 0.001)
	.name('big wave frequency X')
debug
	.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0, 10, 0.001)
	.name('big wave frequency Y')
debug
	.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0, 10, 0.001)
	.name('big wave speed')

debug
	.addColor(debugObject, 'depthColor')
	.onChange(() =>
		waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
	)
debug
	.addColor(debugObject, 'surfaceColor')
	.onChange(() =>
		waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
	)
debug
	.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.001)
	.name('color offset')
debug
	.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 20, 0.001)
	.name('color multiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	waterMaterial.uniforms.uTime.value = elapsedTime
	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
