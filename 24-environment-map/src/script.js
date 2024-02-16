import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import {GroundProjectedSkybox} from 'three/examples/jsm/objects/GroundProjectedSkybox.js'

/**
 * Loaders
 */

const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()
/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 500
})

const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const updateAllMaterials = () => {
    console.log('update all materials')

    scene.traverse(child => {
        if (child.isMesh && child.material.isMeshStandardMaterial){

            child.material.envMapIntensity = global.envMapIntensity
        }
    
    })

    scene.backgroundBlurriness = global.backgroundBlurriness
    scene.backgroundIntensity = global.backgroundIntensity
}

global.backgroundBlurriness = 0
gui.add(global, "backgroundBlurriness", 0, 1.2, 0.0001).onChange(updateAllMaterials)

global.backgroundIntensity = 1
gui.add(global, "backgroundIntensity", 0 ,10 ,0.01).onChange(updateAllMaterials)

global.envMapIntensity = 1
gui.add(global, "envMapIntensity", 0, 10, 0.1)
.onChange(updateAllMaterials)

/**
 * HDR (RGBE)
 */

// rgbeLoader.load('/environmentMaps/2/2k.hdr', envMap => {
//     envMap.mapping= THREE.EquirectangularReflectionMapping
//     scene.environment = envMap

//     const skybox = new GroundProjectedSkybox(envMap)
//     skybox.radius = 34
//     skybox.height = 7
//     skybox.scale.setScalar(50)
//     scene.add(skybox)

//     gui.add(skybox, "radius", 1, 200, 0.1).name("skyboxRadius")
//     gui.add(skybox, "height", 1, 200, 0.1).name("skyboxHeight")

// })

/**
 * 
 * Realtime env map
 */

const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')

environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap

const donut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10,4,2)})
)

donut.position.y = 3.5
donut.layers.enable(1)
scene.add(donut)


/**
 * 
 * Cube render target
 */

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(64, {
    type: THREE.HalfFloatType
})

scene.environment = cubeRenderTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)

cubeCamera.layers.set(1)

// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png', // positive x (right)
//     '/environmentMaps/0/nx.png', // negative x (left)
//     '/environmentMaps/0/py.png', // positive y (top)
//     '/environmentMaps/0/ny.png', // negative y (bottom)
//     '/environmentMaps/0/pz.png', // positive z (front)
//     '/environmentMaps/0/nz.png'  // negative z (back)
// ])

// scene.environment = environmentMap
// scene.background = environmentMap
scene.backgroundBlurriness = global.backgroundBlurriness

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 0.7,
        color: 0xaaaaaa
    })
)
torusKnot.position.y = 4
torusKnot.position.x = -4
scene.add(torusKnot)

/**
 * Models
 */

gltfLoader.load(
    "/models/FlightHelmet/glTF/FlightHelmet.gltf",
    (gltf) =>
    {
        console.log('success')
        console.log(gltf)
        
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)

        updateAllMaterials()
    },
)

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    if (donut){
        donut.rotation.x = Math.sin(elapsedTime * 0.5)*2
        cubeCamera.update(renderer,scene)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()