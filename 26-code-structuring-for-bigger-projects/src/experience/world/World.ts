import * as THREE from 'three'

import Experience from '../Experience'
import Environment from './Environment'

export default class World {
	experience: Experience
	scene: THREE.Scene
	environment: Environment

	constructor(experience: Experience) {
		this.experience = experience

		this.scene = this.experience.scene

		// test mesh
		const testMesh = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshStandardMaterial()
		)

		this.scene.add(testMesh)

		// Environment
		this.environment = new Environment(experience)
	}
}
