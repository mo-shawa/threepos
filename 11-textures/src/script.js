import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


// Textures


// OG way
/* const image = new Image()
image.src = '/textures/door/color.jpg'

const texture = new THREE.Texture(image)

image.onload = () => {
    texture.needsUpdate = true
} */

// better way

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    console.log('start')
}
loadingManager.onProgress = e => {
    console.log('Progress: ', e)
}
loadingManager.onLoad = () => {
    console.log('loaded')
}
loadingManager.onError = err => {
    console.log('Error: ', err)
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
/* const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg') */

// // you can manipulate the shit out of textures:
// colorTexture.repeat.x = 5 // repeat ratio
// colorTexture.repeat.y = 7
// colorTexture.wrapS = THREE.RepeatWrapping /* or THREE.MirroredRepeatWrapping , same but mirrored */ // turn on repeat X
// colorTexture.wrapT = THREE.RepeatWrapping // turn on repeat Y
// colorTexture.offset.x = 0.5 // offset - self evident
// colorTexture.offset.y = 0.3
// // When it comes to "circular" operations, always use fractions or multiples of PI 
// colorTexture.rotation = Math.PI / 4

// mipmapping 
// halving of texture dimensions depending on how many pixels of it is visible on your resolution/zoom etc
// as a result textures dimensions should be powers of 2 (128, 256, 512 etc.)

colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter // set magfilter to nearest for small undetailed textures to sharpen up
// Nearest filter gives performance gains but oversharpens up detailed textures - looks bad sometimes

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ 
    map: colorTexture, 
    alphaMap: alphaTexture
    // height: heightTexture 
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
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