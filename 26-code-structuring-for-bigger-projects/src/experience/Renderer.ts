import * as THREE from 'three'

import Camera from './Camera'
import Experience from './Experience'
import Sizes from './utils/Sizes'

export default class Renderer {
	instance: THREE.WebGLRenderer

	experience: Experience
	canvas: HTMLCanvasElement
	sizes: Sizes
	scene: THREE.Scene
	camera: Camera

	constructor(experience: Experience) {
		this.experience = experience

		this.canvas = this.experience.canvas
		this.sizes = this.experience.sizes
		this.scene = this.experience.scene
		this.camera = this.experience.camera

		this.setInstance()
	}

	setInstance() {
		this.instance = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		})

		this.instance.toneMapping = THREE.CineonToneMapping
		this.instance.toneMappingExposure = 1.75
		this.instance.shadowMap.enabled = true
		this.instance.shadowMap.type = THREE.PCFSoftShadowMap
		this.instance.setClearColor('#211d20')
		this.instance.setSize(this.sizes.width, this.sizes.height)
		this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	}

	resize() {
		this.instance.setSize(this.sizes.width, this.sizes.height)
		this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	}

	update() {
		this.instance.render(this.scene, this.camera.instance)
	}
}