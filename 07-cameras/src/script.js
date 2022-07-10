import './style.css'
import * as THREE from 'three'
import { ArrayCamera, CubeCamera, OrthographicCamera, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Camera types:

/* Camera class: not to be used directly: use only to inherit if you're extending the class

PerspectiveCamera: normal camera, it what you think of when you think of a camera

ArrayCamera: allows you to use different parts of the renderer to show different camera perspectives -> things like old school split screen multiplayer, maybe alternate view (main first person and top down in the corner etc).

StereoCamera: VR view, one camera per eye 

CubeCamera: 6 renders in cube layout, used for surroundings (skyboxes? I think) and reflections, refractions

OrthographicCamera: renders the scene without perspective -> far objects and close objects appear to be the same distance (things like RTS top down games)


 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
// PerspectiveCamera Parameters:
/*
- FOV: Vertical, not horizontal, 45-75 ideal. Distortion at renderer edges at higher FOVs - like 2d map of a globe
- Aspect Ratio: width divided by height of container/viewport
- Near: minimum object distance before visibility cutoff -> closer than provided value doesn't show - default 1
- Far: maximum object distance for visibility - default 1000
 */
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)


// OrthographicCamera Parameters:
/*
- Takes 4 distance parameters which are how far the camera can see in each direction
- Left, Right, Top, Bottom
- 5th and 6th parameters are near and far just like perspective camera  
*/
// const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.1, 100)
/* Aspect ratio is not accounted for in parameters, so the cube looks distorted and non-cubic
to fix that we would multiply the left and right parameters by the aspect ratio */
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

// Control camera with mouse
/* We can do it custom or use OrbitControls
Orbit controls config references camera so has to come after camera instance  */

// Custom:
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', e => {
    // (e.clientX, e.clientY) give us raw cursor coordinates
    // ideally, we want values between -0.5 and 0.5
    // dividing e.client by sizes gives us a value between 0 and 1, and then we could just subtract 0.5 from that number
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = e.clientY / sizes.height - 0.5
    console.log(cursor)
})



const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

////////////////////////////////////

// OrbitControls:
const controls = new OrbitControls(camera, canvas)
// looks at center of scene by default, change with controls.target and then controls.update() in the tick loop
/* controls.target.y = 1 */
// weighted scroll, also needs controls.update() in loop
controls.enableDamping = true
/* controls.update() */

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // Update objects
    /*     
    mesh.rotation.y = elapsedTime;
    mesh.position.y = .5 * Math.sin(elapsedTime) 
    */

    // Mouse control
    // Camera position on cursor


    /*  camera.position.x = cursor.x
     camera.position.y = - cursor.y */


    // Amplified version

    /* camera.position.x = cursor.x * 5
    camera.position.y = - cursor.y * 5
    camera.lookAt(mesh.position) */


    // rotation on cursor (look at cursor effect)
    /*    
    mesh.rotation.y = cursor.x
    mesh.rotation.x = cursor.y
     */

    // Full rotation of the camera
    /* 
    sin and cos, when combined and used with the same angle, enable us to place things on a circle. To do a full rotation, that angle must have an amplitude of 2 times π (called "pi"). Just so you know, a full rotation is called a "tau" but we don't have access to this value in JavaScript and we have to use π instead.

    You can access an approximation of π in native JavaScript using Math.PI.

    */

    /*  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
     camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
     camera.position.y = cursor.y * 3
     camera.lookAt(mesh.position) */

    // Render
    controls.update()
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()