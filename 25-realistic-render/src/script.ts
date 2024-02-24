import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
dracoLoader.preload()

gltfLoader.setDRACOLoader(dracoLoader)

const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new GUI()
const global = {
	envMapIntensity: 1,
}

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')
if (!canvas) throw new Error('canvas not found')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */

const isMesh = (
	node: THREE.Object3D<THREE.Object3DEventMap>
): node is THREE.Mesh => node instanceof THREE.Mesh

const isStandardMaterial = (
	material: THREE.Mesh['material']
): material is THREE.MeshStandardMaterial =>
	material instanceof THREE.MeshStandardMaterial

const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (isMesh(child) && isStandardMaterial(child.material)) {
			child.material.envMapIntensity = global.envMapIntensity
			child.castShadow = true
			child.receiveShadow = true
		}
	})
}

/**
 * Environment map
 */
// Global intensity
gui
	.add(global, 'envMapIntensity')
	.min(0)
	.max(10)
	.step(0.001)
	.onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
	environmentMap.mapping = THREE.EquirectangularReflectionMapping

	scene.background = environmentMap
	scene.environment = environmentMap
})

const directionalLight = new THREE.DirectionalLight('#ffffff', 6)
directionalLight.position.set(-4, 6.5, 2.5)

directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix(false, false)

directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(512, 512)

scene.add(directionalLight)

const directionalLightHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera
)
// scene.add(directionalLightHelper)

gui.add(directionalLight, 'castShadow')
gui.add(directionalLight, 'intensity', 0, 10, 0.001)
gui.add(directionalLight.position, 'x', -10, 10, 0.001)
gui.add(directionalLight.position, 'y', -10, 10, 0.001)
gui.add(directionalLight.position, 'z', -10, 10, 0.001)
gui.add(directionalLight.shadow, 'normalBias', -0.05, 0.05, 0.001)
gui.add(directionalLight.shadow, 'bias', -0.05, 0.05, 0.001)

/**
 * Models
 */
// Helmet
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	gltf.scene.scale.set(10, 10, 10)
	gltf.scene.castShadow = true
	scene.add(gltf.scene)

	updateAllMaterials()
})

gltfLoader.load('/models/myburger.glb', (gltf) => {
	gltf.scene.scale.set(0.3, 0.3, 0.3)
	gltf.scene.position.set(0, 0, 3.5)

	gltf.scene.castShadow = true
	gltf.scene.receiveShadow = true

	scene.add(gltf.scene)

	updateAllMaterials()
})

const brickColorTexture = textureLoader.load(
	'/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg'
)
brickColorTexture.colorSpace = 'srgb'
const brickAORoughnessMetalnessMap = textureLoader.load(
	'/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg'
)
const brickNormalMap = textureLoader.load(
	'/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png'
)

const brickWall = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		map: brickColorTexture,
		aoMap: brickAORoughnessMetalnessMap,
		metalnessMap: brickAORoughnessMetalnessMap,
		roughnessMap: brickAORoughnessMetalnessMap,
		normalMap: brickNormalMap,
	})
)

brickWall.position.set(0, 4, -4)

scene.add(brickWall)

const woodColorTexture = textureLoader.load(
	'/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg'
)
woodColorTexture.colorSpace = 'srgb'
const woodAORoughnessMetalnessMap = textureLoader.load(
	'/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg'
)
const woodNormalMap = textureLoader.load(
	'/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png'
)

const woodFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		map: woodColorTexture,
		aoMap: woodAORoughnessMetalnessMap,
		metalnessMap: woodAORoughnessMetalnessMap,
		roughnessMap: woodAORoughnessMetalnessMap,
		normalMap: woodNormalMap,
	})
)

woodFloor.rotateOnAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2)
scene.add(woodFloor)

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
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: window.devicePixelRatio < 2,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
	No: THREE.NoToneMapping,
	Linear: THREE.LinearToneMapping,
	Reinhard: THREE.ReinhardToneMapping,
	Cineon: THREE.CineonToneMapping,
	ACESFilmic: THREE.ACESFilmicToneMapping,
})
gui.add(renderer, 'toneMappingExposure', 0, 10, 0.001)

/**
 * Animate
 */
const tick = () => {
	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
