import * as THREE from 'three'

import Camera from './Camera'
import Renderer from './Renderer'
import { sources } from './sources'
import Resources from './utils/Resources'
import Sizes from './utils/Sizes'
import Time from './utils/Time'
import World from './world/World'

export default class Experience {
	canvas: HTMLCanvasElement
	sizes: Sizes
	time: Time
	scene: THREE.Scene
	resources: Resources
	camera: Camera
	renderer: Renderer
	world: World

	constructor(canvas: HTMLCanvasElement) {
		// Global access
		window.experience = this

		this.sizes = new Sizes()
		this.time = new Time()

		this.canvas = canvas
		this.scene = new THREE.Scene()
		this.resources = new Resources(sources)

		this.camera = new Camera(this)
		this.renderer = new Renderer(this)
		this.world = new World(this)

		this.sizes.addEventListener('resize', () => {
			this.resize()
		})

		this.time.addEventListener('tick', () => {
			this.update()
		})
	}

	resize() {
		this.camera.resize()
		this.renderer.resize()
	}

	update() {
		this.camera.update() // make sure to update camera before renderer
		this.renderer.update()
	}
}
