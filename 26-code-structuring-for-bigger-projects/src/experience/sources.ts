export const sources: Asset[] = [
	{
		name: 'environmentMapTexture',
		type: 'cubeTexture',
		path: [
			'/textures/environmentMap/px.jpg',
			'/textures/environmentMap/nx.jpg',
			'/textures/environmentMap/py.jpg',
			'/textures/environmentMap/ny.jpg',
			'/textures/environmentMap/pz.jpg',
			'/textures/environmentMap/nz.jpg',
		],
	},
	{
		name: 'grassColorTexture',
		type: 'texture',
		path: '/textures/dirt/color.jpg',
	},
	{
		name: 'grassNormalTexture',
		type: 'texture',
		path: '/textures/dirt/normal.jpg',
	},
	{
		name: 'foxModel',
		type: 'gltfModel',
		path: '/models/Fox/glTF/Fox.gltf',
	},
] as const

export type Asset =
	| {
			name: string
			type: 'gltfModel' | 'texture'
			path: string
	  }
	| {
			name: string
			type: 'cubeTexture'
			path: Tuple<string, 6>
	  }

interface Tuple<T extends unknown, L extends number> extends Array<T> {
	length: L
}
