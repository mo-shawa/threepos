import GUI from 'lil-gui'
import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import Experience from '../Experience'
import Debug from '../utils/Debug'
import Resources from '../utils/Resources'
import Time from '../utils/Time'
import { isMesh, isStandardMaterial } from '../utils/utils'

export default class Fox {
	debug: Debug
	debugFolder: GUI
	experience: Experience
	scene: THREE.Scene
	resources: Resources
	time: Time
	resource: GLTF
	model: THREE.Group<THREE.Object3DEventMap>
	animation: {
		mixer?: THREE.AnimationMixer
		actions: { [key: string]: THREE.AnimationAction }
	} = { actions: {} }

	constructor(experience: Experience) {
		this.experience = experience

		this.debug = this.experience.debug
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.time = this.experience.time

		this.resource = this.resources.items.foxModel as GLTF

		if (this.debug.active) {
			this.debugFolder = this.debug.ui!.addFolder('fox')
		}

		this.setModel()
		this.setAnimation()
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

	setAnimation() {
		// prettier-ignore
		this.animation.mixer = new THREE.AnimationMixer(this.model),
		
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
		this.animation.actions.walking = this.animation.mixer.clipAction(
			this.resource.animations[1]
		)
		this.animation.actions.running = this.animation.mixer.clipAction(
			this.resource.animations[2]
		)

		this.animation.actions.current = this.animation.actions.idle
		this.animation.actions.current.play()

		if (this.debug.active) {
			const debugObject = {
				playIdle: () => this.playAnimation('idle'),
				playWalking: () => this.playAnimation('walking'),
				playRunning: () => this.playAnimation('running'),
			}

			this.debugFolder.add(debugObject, 'playIdle')
			this.debugFolder.add(debugObject, 'playWalking')
			this.debugFolder.add(debugObject, 'playRunning')
		}
	}

	playAnimation(name: string) {
		const newAction = this.animation.actions[name]
		const oldAction = this.animation.actions.current

		newAction.reset()
		newAction.play()

		newAction.crossFadeFrom(oldAction, 1, true)

		this.animation.actions.current = newAction
	}

	update() {
		this.animation.mixer?.update(this.time.delta / 1000)
	}
}
