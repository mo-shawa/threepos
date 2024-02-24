import * as THREE from 'three'

import Experience from '../Experience'

export default class Environment {
	experience: Experience
	scene: THREE.Scene
	sunLight: THREE.DirectionalLight

	constructor(experience: Experience) {
		this.experience = experience

		this.scene = this.experience.scene

		this.setSunLight()
	}

	setSunLight() {
		this.sunLight = new THREE.DirectionalLight('white', 4)
		this.sunLight.castShadow = true
		this.sunLight.shadow.camera.far = 15
		this.sunLight.shadow.mapSize.set(512, 512)
		this.sunLight.shadow.normalBias = 0.05
		this.sunLight.position.set(3, 3, -2.25)

		this.scene.add(this.sunLight)
	}
}
