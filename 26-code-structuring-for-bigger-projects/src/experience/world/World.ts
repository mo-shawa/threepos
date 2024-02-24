import * as THREE from 'three'

import Experience from '../Experience'

export default class World {
	experience: Experience
	scene: THREE.Scene

	constructor(experience: Experience) {
		this.experience = experience

		this.scene = this.experience.scene

		// test mesh
		const testMesh = new THREE.Mesh(
			new THREE.BoxGeometry(),
			new THREE.MeshBasicMaterial({ wireframe: true })
		)

		this.scene.add(testMesh)
	}
}
