import * as THREE from 'three'

import Camera from './Camera'
import Renderer from './Renderer'
import { sources } from './sources'
import Debug from './utils/Debug'
import Resources from './utils/Resources'
import Sizes from './utils/Sizes'
import Time from './utils/Time'
import { isMesh } from './utils/utils'
import World from './world/World'

export default class Experience {
	canvas: HTMLCanvasElement
	debug: Debug
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

		this.debug = new Debug()
		this.sizes = new Sizes()
		this.time = new Time()

		this.canvas = canvas
		this.scene = new THREE.Scene()
		this.resources = new Resources(sources)

		this.camera = new Camera(this)
		this.renderer = new Renderer(this)
		this.world = new World(this)

		this.sizes.addEventListener('resize', this.resize)

		this.time.addEventListener('tick', this.update)
	}

	resize = () => {
		this.camera.resize()
		this.renderer.resize()
	}

	update = () => {
		this.camera.update() // make sure to update camera before renderer
		this.world.update()
		this.renderer.update()
	}

	destroy() {
		this.sizes.destroy()
		this.sizes.removeEventListener('resize', this.resize)

		this.time.destroy()
		this.time.removeEventListener('tick', this.update)

		// Traverse the scene
		this.scene.traverse((node) => {
			if (isMesh(node)) {
				node.geometry.dispose()

				for (const key in node.material) {
					// @ts-ignore
					const value = node.material[key]

					if (value && typeof value.dispose === 'function') {
						value.dispose()
					}
				}
			}
		})

		this.camera.controls.dispose()
		this.renderer.instance.dispose()

		this.debug.ui?.destroy()
	}
}
