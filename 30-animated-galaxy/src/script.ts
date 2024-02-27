import GUI from 'lil-gui'
import Stats from 'stats.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import galaxyFragmentShader from './shaders/galaxy/fragment.glsl'
import galaxyVertexShader from './shaders/galaxy/vertex.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')
if (!canvas) throw new Error('Canvas not found')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {
	count: 200000,
	size: 45,
	radius: 5,
	branches: 3,
	randomness: 0.75,
	randomnessPower: 1.3,
	insideColor: '#b66d58',
	outsideColor: '#c1cdec',
	timeMultiplier: 1,
} as const

let geometry: THREE.BufferGeometry | null = null
let material: THREE.ShaderMaterial | null = null
let points: THREE.Points | null = null

const generateGalaxy = () => {
	if (points !== null) {
		geometry?.dispose()
		material?.dispose()
		scene.remove(points)
	}

	const positions = new Float32Array(parameters.count * 3)
	const randomness = new Float32Array(parameters.count * 3)
	const scales = new Float32Array(parameters.count)
	/**
	 * Geometry
	 */
	geometry = new THREE.BufferGeometry()

	for (let i = 0; i < parameters.count; i++) {
		const i3 = i * 3

		// Position
		const radius = Math.random() * parameters.radius

		const branchAngle =
			((i % parameters.branches) / parameters.branches) * Math.PI * 2

		const randomX =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius
		const randomY =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius
		const randomZ =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius

		positions[i3] = Math.cos(branchAngle) * radius
		positions[i3 + 1] = 0
		positions[i3 + 2] = Math.sin(branchAngle) * radius

		randomness[i3] = randomX
		randomness[i3 + 1] = randomY
		randomness[i3 + 2] = randomZ

		// Scales
		scales[i] = Math.random()
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
	geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
	geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

	/**
	 * Material
	 */
	material = new THREE.ShaderMaterial({
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
		vertexShader: galaxyVertexShader,
		fragmentShader: galaxyFragmentShader,
		uniforms: {
			uTime: { value: 0 },
			uTimeMultiplier: { value: parameters.timeMultiplier },

			uSize: { value: parameters.size * renderer.getPixelRatio() },

			uInsideColor: { value: new THREE.Color(parameters.insideColor) },
			uOutsideColor: { value: new THREE.Color(parameters.outsideColor) },

			uRadius: { value: parameters.radius },
		},
	})
	/**
	 * Points
	 */
	points = new THREE.Points(geometry, material)
	scene.add(points)
}

gui
	.add(parameters, 'timeMultiplier')
	.min(0)
	.max(10)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'count')
	.min(100)
	.max(1000000)
	.step(100)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'size')
	.min(1)
	.max(100)
	.step(0.5)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'radius')
	.min(0.01)
	.max(20)
	.step(0.01)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'branches')
	.min(2)
	.max(20)
	.step(1)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'randomness')
	.min(0)
	.max(2)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'randomnessPower')
	.min(1)
	.max(10)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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
	stats.begin()
	const elapsedTime = clock.getElapsedTime()
	if (material) material.uniforms.uTime.value = elapsedTime
	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	stats.end()
	window.requestAnimationFrame(tick)
}

console.log(renderer.getPixelRatio())
generateGalaxy()
tick()
