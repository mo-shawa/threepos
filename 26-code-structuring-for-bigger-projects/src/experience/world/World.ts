import * as THREE from 'three'

import Experience from '../Experience'
import Resources from '../utils/Resources'
import Environment from './Environment'
import Floor from './Floor'
import Fox from './Fox'

export default class World {
	experience: Experience
	scene: THREE.Scene
	environment: Environment
	resources: Resources
	floor: Floor
	fox: Fox

	constructor(experience: Experience) {
		this.experience = experience

		this.scene = this.experience.scene
		this.resources = this.experience.resources

		this.resources.addEventListener('assetsLoaded', () => {
			console.log('assets all loaded')

			// Environment
			this.floor = new Floor(experience)
			this.fox = new Fox(experience)
			this.environment = new Environment(experience)
		})
	}
}
