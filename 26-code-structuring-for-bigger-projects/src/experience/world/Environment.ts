import GUI from 'lil-gui'
import * as THREE from 'three'

import Experience from '../Experience'
import Debug from '../utils/Debug'
import Resources from '../utils/Resources'
import { isMesh, isStandardMaterial } from '../utils/utils'

export default class Environment {
	experience: Experience
	scene: THREE.Scene
	sunLight: THREE.DirectionalLight
	resources: Resources
	environmentMap: EnvironmentMap
	debug: Debug
	debugFolder: GUI

	constructor(experience: Experience) {
		this.experience = experience
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		if (this.debug.active) {
			this.debugFolder = this.debug.ui!.addFolder('environment')
		}

		this.setSunLight()
		this.setEnvironmentMap()
	}

	setSunLight() {
		this.sunLight = new THREE.DirectionalLight('white', 4)
		this.sunLight.castShadow = true
		this.sunLight.shadow.camera.far = 15
		this.sunLight.shadow.mapSize.set(512, 512)
		this.sunLight.shadow.normalBias = 0.05
		this.sunLight.position.set(3, 3, -2.25)

		this.scene.add(this.sunLight)

		// Debug
		if (this.debug.active) {
			this.debugFolder
				.add(this.sunLight, 'intensity', 0, 10, 0.001)
				.name('sunglightIntensity')

			this.debugFolder
				.add(this.sunLight.position, 'x', -10, 10, 0.001)
				.name('sunlightX')
		}
		this.debugFolder
			.add(this.sunLight.position, 'y', 0, 10, 0.001)
			.name('sunlightY')
		this.debugFolder
			.add(this.sunLight.position, 'z', -10, 10, 0.001)
			.name('sunlightZ')
	}

	setEnvironmentMap() {
		this.environmentMap = {
			intensity: 0.4,
			texture: this.resources.items.environmentMapTexture as THREE.CubeTexture,
		}
		this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

		this.scene.environment = this.environmentMap.texture

		this.updateEnvMapMaterials()

		// Debug
		if (this.debug.active) {
			this.debugFolder
				.add(this.environmentMap, 'intensity', 0, 4, 0.001)
				.name('envMapIntensity')
				.onChange(() => this.updateEnvMapMaterials())
		}
	}

	updateEnvMapMaterials() {
		this.scene.traverse((child) => {
			if (isMesh(child) && isStandardMaterial(child.material)) {
				child.material.envMap = this.environmentMap.texture
				child.material.envMapIntensity = this.environmentMap.intensity
				child.material.needsUpdate = true
			}
		})
	}
}

type EnvironmentMap = {
	intensity: number
	texture: THREE.CubeTexture
}
