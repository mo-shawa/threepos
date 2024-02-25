import * as THREE from 'three'

import Experience from '../Experience'
import Resources, { SourceFile } from '../utils/Resources'
import { isTexture } from '../utils/utils'

export default class Floor {
	experience: Experience
	scene: THREE.Scene
	resources: Resources
	geometry: THREE.CircleGeometry
	textures: { [key: string]: THREE.Texture }
	material: THREE.MeshStandardMaterial
	mesh: THREE.Mesh

	constructor(experience: Experience) {
		this.experience = experience
		this.scene = this.experience.scene
		this.resources = this.experience.resources

		this.setGeometry()
		this.setTextures()
		this.setMaterial()
		this.setMesh()
	}
	setGeometry() {
		this.geometry = new THREE.CircleGeometry(5, 64)
	}

	setTextures() {
		const color = this.resources.items.grassColorTexture as THREE.Texture
		color.colorSpace = THREE.SRGBColorSpace
		color.repeat.set(1.5, 1.5)
		color.wrapS = THREE.RepeatWrapping
		color.wrapT = THREE.RepeatWrapping

		const normal = this.resources.items.grassNormalTexture as THREE.Texture
		normal.repeat.set(1.5, 1.5)
		normal.wrapS = THREE.RepeatWrapping
		normal.wrapT = THREE.RepeatWrapping

		this.textures = {
			color,
			normal,
		}

		this.textures
	}

	setMaterial() {
		this.material = new THREE.MeshStandardMaterial({
			map: this.textures.color,
			normalMap: this.textures.normal,
		})
	}

	setMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material)
		this.mesh.rotation.x = -Math.PI / 2
		this.mesh.receiveShadow = true
		this.scene.add(this.mesh)
	}
}
