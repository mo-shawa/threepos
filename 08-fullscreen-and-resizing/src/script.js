import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    // innerWidth/Height works
    // see changes in style.css
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // set sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // need to update camera aspect ratio
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // update renderer/canvas
    renderer.setSize(sizes.width, sizes.height)
})

// go full screen on double click
window.addEventListener('dblclick', () => {

    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement //support for safari
    const requestFullscreen = () => canvas.requestFullscreen() || canvas.webkitRequestFullscreen()
    const exitFullscreen = () => document.exitFullscreen() || document.webkitExitFullscreen()

    if (!fullscreenElement) return requestFullscreen()
    return exitFullscreen()

    // most basic way
    /*    if (document.fullscreenElement) return document.exitFullscreen()
       return canvas.requestFullscreen() */
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
// Account for devices with higher pixel ratios (ex: retina displays)
// above 2 is not discernable, so we grab smaller number between devicePixelRatio and 2

const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)



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