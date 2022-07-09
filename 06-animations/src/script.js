import './style.css'
import * as THREE from 'three'
import gsap from "gsap"

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: innerWidth,
    height: innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// gsap example
// super low boilerplate
/* gsap.to(mesh.position, { x: 1, y: 1, duration: 2 })
function tick() {
    camera.lookAt(mesh.position)
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
} */
//////////////////////////////////////////

// // THREE.Clock superior strategy

let clock = new THREE.Clock()

function tick() {
    const timeDelta = clock.getElapsedTime()
    mesh.position.y = Math.sin(timeDelta)
    mesh.position.x = Math.cos(timeDelta)
    mesh.position.z = Math.tan(timeDelta)
    camera.lookAt(mesh.position)
    renderer.render(scene, camera)

    requestAnimationFrame(tick)
}

////////////////////////////////////////////

// let time = Date.now()

/* function tick() {
    const currentTime = Date.now()
    const timeDelta = currentTime - time
    time = Date.now()
    mesh.position.y = Math.sin(timeDelta)
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
} */

tick()