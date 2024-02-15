import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import * as CANNON from "cannon-es"

/**
 * Debug
 */
const gui = new dat.GUI()

const debugObject = {
	createSphere: () =>
		createSphere(Math.random() + 0.1, {
			x: (Math.random() - 0.5) * 2,
			y: 3,
			z: (Math.random() - 0.5) * 2,
		}),
	createBox: () => {
		createBox(Math.random(), Math.random(), Math.random(), {
			x: (Math.random() - 0.5) * 2,
			y: 3,
			z: (Math.random() - 0.5) * 3,
		})
	},
	reset: () => {
		for (const object of objectsToUpdate) {
			// Cannon housekeeping
			object.body.removeEventListener("collide", playHitSound)
			world.removeBody(object.body)

			// Three
			scene.remove(object.mesh)

			// Empty our objectsToUpdate array
			objectsToUpdate = []
		}
	},
}
gui.add(debugObject, "createSphere")
gui.add(debugObject, "createBox")
gui.add(debugObject, "reset")

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Sounds
const hitSound = new Audio("/sounds/hit.mp3")

const playHitSound = (collision) => {
	const impactForce = collision.contact.getImpactVelocityAlongNormal()
	console.log(impactForce)
	if (impactForce < 0.15) return
	hitSound.volume = Math.min(1, Math.abs(impactForce))
	hitSound.currentTime = 0
	hitSound.play()
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
	"/textures/environmentMaps/0/px.png",
	"/textures/environmentMaps/0/nx.png",
	"/textures/environmentMaps/0/py.png",
	"/textures/environmentMaps/0/ny.png",
	"/textures/environmentMaps/0/pz.png",
	"/textures/environmentMaps/0/nz.png",
])

// Physics

// Contact Material
const defaultMaterial = new CANNON.Material("default")
const defaultContactMaterial = new CANNON.ContactMaterial(
	defaultMaterial,
	defaultMaterial,
	{
		restitution: 0.7,
		friction: 0.5,
	}
)

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.defaultContactMaterial = defaultContactMaterial

// Broadphase
// by default, Cannon tests all bodies against all other bodies in the world (naive broadphase)
// this is not scalable at all, but least prone to bugs (from fast moving objects)
// most cases would benefit massively from using localized testing (Grid or SAPBroadphase)
world.broadphase = new CANNON.SAPBroadphase(world)
// Another big performance hit comes from the fact that all objects are always "active" and calculating
// Objects that are still and have been for some time can be allowed to go to "sleep" with world.allowsleep
// again massively reducing redundant calculations and better for low end devices/phones etc.
world.allowSleep = true

// Sphere
/* const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
	mass: 1,
	position: new CANNON.Vec3(0, 3, 0),
	shape: sphereShape,
})

sphereBody.applyLocalForce(
	new CANNON.Vec3(150, 90, 0),
	new CANNON.Vec3(0, 0, 0)
)

world.addBody(sphereBody) */

let objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture,
})

const createSphere = (radius, position) => {
	const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
	mesh.scale.set(radius, radius, radius)
	mesh.castShadow = true
	mesh.position.copy(position)
	scene.add(mesh)

	// Cannon JS Body
	const shape = new CANNON.Sphere(radius)
	const body = new CANNON.Body({
		mass: 1,
		shape,
		material: defaultMaterial,
	})
	body.position.copy(position)
	world.addBody(body)

	objectsToUpdate.push({ mesh, body })
}

createSphere(0.5, { x: 1, y: 2, z: 3 })

// Boxes

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshToonMaterial()

const createBox = (width, height, depth, position) => {
	const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
	mesh.castShadow = true
	mesh.position.copy(position)
	mesh.scale.set(width, height, depth)
	scene.add(mesh)

	const shape = new CANNON.Box(
		new CANNON.Vec3(width / 2, height / 2, depth / 2)
	)
	const body = new CANNON.Body({
		shape,
		material: defaultMaterial,
		mass: 2,
	})
	body.position.copy(position)
	body.addEventListener("collide", playHitSound)
	world.addBody(body)

	objectsToUpdate.push({ mesh, body })
}

createBox(1, 2, 3, { x: 0, y: 2, z: 1 })

// Floor

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
	mass: 0,
	shape: floorShape,
})

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2)

world.addBody(floorBody)

/**
 * Test sphere
 */
/* const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshStandardMaterial({
		metalness: 0.3,
		roughness: 0.4,
		envMap: environmentMapTexture,
		envMapIntensity: 0.5,
	})
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere) */

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: "#777777",
		metalness: 0.3,
		roughness: 0.4,
		envMap: environmentMapTexture,
		envMapIntensity: 0.5,
	})
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(-3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
	const elapsedTime = clock.getElapsedTime()
	const deltaTime = elapsedTime - oldElapsedTime
	oldElapsedTime = elapsedTime

	// Update Physics World
	world.step(1 / 60, deltaTime)

	for (let object of objectsToUpdate) {
		object.mesh.position.copy(object.body.position)
		object.mesh.quaternion.copy(object.body.quaternion)
	}

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
