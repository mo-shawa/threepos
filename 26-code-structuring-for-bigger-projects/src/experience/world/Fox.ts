import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import Experience from '../Experience'
import Resources from '../utils/Resources'
import { isMesh, isStandardMaterial } from '../utils/utils'

export default class Fox {
	experience: Experience
	scene: THREE.Scene
	resources: Resources
	resource: GLTF
	model: THREE.Group<THREE.Object3DEventMap>

	constructor(experience: Experience) {
		this.experience = experience

		this.scene = this.experience.scene
		this.resources = this.experience.resources

		this.resource = this.resources.items.foxModel as GLTF

		this.setModel()
	}

	setModel() {
		this.model = this.resource.scene
		this.model.scale.set(0.02, 0.02, 0.02)
		this.scene.add(this.model)

		this.model.traverse((child) => {
			if (isMesh(child) && isStandardMaterial(child.material)) {
				child.castShadow = true
			}
		})
	}
}
