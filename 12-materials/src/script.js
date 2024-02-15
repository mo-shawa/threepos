import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const gui = new GUI({width:400})


// Textures
const textureLoader = new THREE.TextureLoader()
// const loadingManager = new THREE.LoadingManager(textureLoader)

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

// cube textures:
const cubeLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeLoader.load([ // load order vv
    '/textures/environmentMaps/3/px.jpg', // positive x
    '/textures/environmentMaps/3/nx.jpg', // negative x
    '/textures/environmentMaps/3/py.jpg', // positive y
    '/textures/environmentMaps/3/ny.jpg', // negative y
    '/textures/environmentMaps/3/pz.jpg', // positive z
    '/textures/environmentMaps/3/nz.jpg', // negative z 
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Materials
// Material options:
////////////////////

// MeshBasicMaterial: standard material, map a color texture over it 

// const material = new THREE.MeshBasicMaterial({
//     map: doorColorTexture,
//     // options:
//     /* wireframe: true, */
//     /* opacity: 1.2,  */
//     /* transparent: true, */ // both opacity and alphaMap require transparent = true
//     /* alphaMap: doorAlphaTexture */
    
// })


// you can color over a mesh with material.color, or tint it by using a color combined with map

/* material.color = new THREE.Color('rgba(255,0,0, 0.1)') */


// MeshNormalMaterial: represents direction of outside face with color - very clear with plane
//  important for shadows
//  looks great with flatShading = true

// MeshMatcapMaterial: sets the color on the mesh based on the normals
//  great to fake shadows without lighting = lightweight
//  can create your own by shading/lighting a circle in photoshop or sphere in blender
//  
/* const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
}) 
 */

// MeshDepthMaterial: it'll color the mesh in white if its close and black if its far
/* const material = new THREE.MeshDepthMaterial()
 */

// MATERIALS THAT REACT TO LIGHT::
/* ///////////////////////////////// */
// MeshLambertMaterial: very performant, some visual artifacts

/* const material = new THREE.MeshLambertMaterial() */

// MeshPhongMaterial: also shows light reflection, less lightweight but less visual artifacts than LambertMaterial
/* const material = new THREE.MeshPhongMaterial({
    shininess:50,
    specular: new THREE.Color(0xff00ff) // Shininess color
}) */

// MeshToonMaterial: similar to Lambert but cartoonish
//  can be modified with gradient textures
//  gradient textures are very small and subject to getting fucked up by mipmapping
//  so we need to set our min and mag filters to NearestFilter

/* gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter */
// it's also a good idea to deactivate mipmapping if we're using NearestFilter
/* gradientTexture.generateMipmaps = false */
/* 
const material = new THREE.MeshToonMaterial({
    gradientMap: gradientTexture,
})
 */
// MeshStandardMaterial: uses PhysicallyBasedRendering (PBR), supports light like previous two materials but more realistic + access to things like roughness and metalness
// this is the GOAT, but more GPU expensive

const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2, // don't use metalness and roughness properties if using equivalent maps
    // map: doorColorTexture, // have access to color maps 
    // aoMap: doorAmbientOcclusionTexture, // and ambient occlusion, but Three needs us to set "uv2" attribute on the Geometry
    // aoMapIntensity: 1,
    // displacementMap: doorHeightTexture, // "terrain" type effect, height displacement on vertices
    // // need to increase vertices to show full effect, and decrease displacementScale to make it more realistic
    // displacementScale:.1,
    // metalnessMap: doorMetalnessTexture,
    // roughnessMap: doorRoughnessTexture,
    // normalMap: doorNormalTexture,
    // alphaMap: doorAlphaTexture, // remember requires transparent = true
    // transparent: true

    envMap: environmentMapTexture

})

material.normalScale.set(0.5,0.5)

gui.add(material, 'metalness').min(0).max(5).step(0.0001)
gui.add(material, 'roughness').min(0).max(5).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material,'displacementScale').min(0).max(1).step(0.0001)


// MeshPhysicalMaterial: same as MeshStandardMaterial but has support for a "clear coat" effect

// PointsMaterial: used for particles (!!)

// ShaderMaterial + RawShaderMaterial: use to create your own material with custom shaders




//

// Objects:
///////////////////////

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,64,64),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 100,100),
    material
)

// setting uv2 for ambient occlusion mentioned on 104 ^
// we can grab the uv that are already on the geometry
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))
 

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3,0.2,64,128),
    material
)
torus.position.x = -1.5

// plane.rotation.x = Math.PI/2
sphere.position.x = 1.5

scene.add(sphere,plane,torus)

// Lights:
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2,3,4)
scene.add(pointLight)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // update objects
    sphere.rotation.y = 0.1 *elapsedTime
    plane.rotation.y = 0.1 *elapsedTime
    torus.rotation.y = 0.1 *elapsedTime
    
    sphere.rotation.x = 0.15 *elapsedTime
    plane.rotation.x = 0.15 *elapsedTime
    torus.rotation.x = 0.15 *elapsedTime



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()