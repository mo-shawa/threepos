import type { Asset } from '../sources'
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Resources extends EventTarget {
	sources: Asset[]
	items: { [key: string]: SourceFile }
	toLoad: number
	loaded: number
	loaders: Loaders

	constructor(sources: Asset[]) {
		super()

		this.sources = sources

		// Setup
		this.items = {}
		this.toLoad = this.sources.length
		this.loaded = 0

		this.setLoaders()
		this.startLoading()
	}

	setLoaders() {
		this.loaders = {
			gltfLoader: new GLTFLoader(),
			textureLoader: new THREE.TextureLoader(),
			cubeTextureLoader: new THREE.CubeTextureLoader(),
		}
	}

	startLoading() {
		for (const source of this.sources) {
			if (source.type === 'cubeTexture') {
				this.loaders.cubeTextureLoader.load(source.path, (cubeTexture) =>
					this.sourceLoaded(source, cubeTexture)
				)
			}

			if (source.type === 'gltfModel')
				this.loaders.gltfLoader.load(source.path, (gltf) => {
					this.sourceLoaded(source, gltf)
				})

			if (source.type === 'texture') {
				this.loaders.textureLoader.load(source.path, (texture) => {
					this.sourceLoaded(source, texture)
				})
			}
		}
	}

	sourceLoaded(source: Asset, file: SourceFile) {
		this.items[source.name] = file

		this.loaded++

		if (this.loaded === this.toLoad) {
			this.dispatchEvent(new Event('assetsLoaded'))
		}
	}
}

export type SourceFile = GLTF | THREE.CubeTexture | THREE.Texture

type Loaders = {
	gltfLoader: GLTFLoader
	textureLoader: THREE.TextureLoader
	cubeTextureLoader: THREE.CubeTextureLoader
}
