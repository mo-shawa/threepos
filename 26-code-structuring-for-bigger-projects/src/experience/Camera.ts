import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Experience from './Experience'
import Sizes from './utils/Sizes'

export default class Camera {
	instance: THREE.PerspectiveCamera

	experience: Experience
	sizes: Sizes
	scene: THREE.Scene
	canvas: HTMLCanvasElement
	controls: OrbitControls

	constructor(experience: Experience) {
		this.experience = experience
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene
		this.canvas = this.experience.canvas

		this.setInstance()
		this.setOrbitControls()
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			0.1,
			100
		)

		this.instance.position.set(6, 4, 8)
		this.scene.add(this.instance)
	}

	setOrbitControls() {
		this.controls = new OrbitControls(this.instance, this.canvas)
		this.controls.enableDamping = true
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height
		this.instance.updateProjectionMatrix()
	}

	update() {
		this.controls.update()
	}
}
