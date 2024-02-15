import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 })

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
let something = undefined

const parameters = {
	count: 100000,
	size: 0.01,
	baseColor: 0xff00ff,
	radius: 5,
	branches: 3,
	spin: 1,
	randomness: 1,
}

let pointsGeometry = null
let pointsMaterial = null
let points = null

// Galaxy
const generateGalaxy = () => {
	// have to remove previous galaxy on trigger generateGalaxy
	if (points) {
		pointsGeometry.dispose()
		pointsMaterial.dispose()
		scene.remove(points)
	}

	pointsGeometry = new THREE.BufferGeometry()

	const positions = new Float32Array(parameters.count * 3)
	const colors = new Float32Array(parameters.count * 3)

	for (let i = 0; i < parameters.count; i++) {
		const i3 = i * 3 // 0x3=0, 1x3=3, 6, 9 etc. cheaper than looping with 3x more iterations

		// this is actually random position along the radius, actual radius is parameters.radius
		const radius = Math.random() * parameters.radius

		// this will be
		const spinAngle = parameters.spin * radius
		const branchAngle = (i / parameters.branches) * Math.PI * 2 // WAS i % parameters.branches, testing this
		// i3 = x | i3 + 1 = y | i3 + 2 = 3

		const randomX = (Math.random() - 0.5) * parameters.randomness
		const randomY = (Math.random() - 0.5) * parameters.randomness
		const randomZ = (Math.random() - 0.5) * parameters.randomness

		positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX // + 0 just for formatting obv
		positions[i3 + 1] = Math.random() * 0.1 + randomY //
		positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
		/* 	if (i < 30) {
			console.log({
				radius,
				branchAngle,
				positions: [positions[i], positions[i + 1], positions[i + 2]],
			})
		} */
		colors[i3 + 0] = Math.random()
		colors[i3 + 1] = Math.random()
		colors[i3 + 2] = Math.random()
	}

	// don't confuse with setting uv2 attribute for ambient occlusion maps
	// we have an empty geometry, we're setting the positions of the points here
	pointsGeometry.setAttribute(
		"position",
		new THREE.BufferAttribute(positions, 3)
	)
	pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

	pointsMaterial = new THREE.PointsMaterial({
		color: parameters.baseColor,
		size: parameters.size,
		vertexColors: true,
		bleding: THREE.AdditiveBlending,
	})

	points = new THREE.Points(pointsGeometry, pointsMaterial)

	scene.add(points)
}

generateGalaxy()

gui
	.add(parameters, "count")
	.min(100)
	.max(1000000)
	.step(100)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, "size")
	.min(0.001)
	.max(0.1)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, "radius")
	.min(0.01)
	.max(20)
	.step(0.01)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, "branches")
	.min(2)
	.max(20)
	.step(1)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, "spin")
	.min(0)
	.max(2)
	.step(0.01)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, "randomness")
	.min(0)
	.max(2)
	.step(0.01)
	.onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener("resize", () => {
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
	const elapsedTime = clock.getElapsedTime()

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
