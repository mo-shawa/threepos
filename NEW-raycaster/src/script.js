import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import * as dat from "lil-gui"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
)

const object3 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
)
object3.position.x = 2

const objects = [object1, object2, object3]

scene.add(object1, object2, object3)

// Raycaster

const raycaster = new THREE.Raycaster()

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

// Cursor
const cursor = new THREE.Vector2()

window.addEventListener("mousemove", (e) => {
	cursor.x = (e.clientX / sizes.width) * 2 - 1
	cursor.y = -(e.clientY / sizes.height) * 2 + 1
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

// Loader
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")

loader.setDRACOLoader(dracoLoader)

let duck
loader.load("models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
	duck = gltf.scene
	duck.position.y = -0.5
	scene.add(duck)
})

const ambientLight = new THREE.AmbientLight("white", 0.5)

scene.add(ambientLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5
	object2.position.y = Math.sin(elapsedTime * 1.5) * 1.5
	object3.position.y = Math.sin(elapsedTime * 0.2) * 1.5

	raycaster.setFromCamera(cursor, camera)
	// const rayOrigin = new THREE.Vector3(-3, 0, 0)
	// const rayDirection = new THREE.Vector3(10, 0, 0)
	// rayDirection.normalize() // if you have a complex direction and want to normalize

	// raycaster.set(rayOrigin, rayDirection)
	const intersects = raycaster.intersectObjects(objects)
	for (let object of objects) {
		object.material.color = new THREE.Color("red")
	}

	for (let intersect of intersects) {
		intersect.object.material.color.set("blue")
	}

	if (duck) {
		duck.scale.set(1, 1, 1)
		const modelIntersects = raycaster.intersectObject(duck)
		if (modelIntersects.length) duck.scale.set(1.1, 1.1, 1.1)
	}

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
