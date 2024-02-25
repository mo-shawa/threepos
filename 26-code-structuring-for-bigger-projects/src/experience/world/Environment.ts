import * as THREE from 'three'

import Experience from '../Experience'
import Resources from '../utils/Resources'
import { isMesh, isStandardMaterial } from '../utils/utils'

export default class Environment {
	experience: Experience
	scene: THREE.Scene
	sunLight: THREE.DirectionalLight
	resources: Resources
	environmentMap: EnvironmentMap

	constructor(experience: Experience) {
		this.experience = experience
		this.scene = this.experience.scene
		this.resources = this.experience.resources

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
	}

	setEnvironmentMap() {
		this.environmentMap = {
			intensity: 0.4,
			texture: this.resources.items.environmentMapTexture as THREE.CubeTexture,
		}
		this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

		this.scene.environment = this.environmentMap.texture

		this.updateEnvironmentMapMaterial()
	}

	updateEnvironmentMapMaterial() {
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
