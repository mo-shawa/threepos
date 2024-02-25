import * as THREE from 'three'

export const isMesh = (node: unknown): node is THREE.Mesh =>
	node instanceof THREE.Mesh

export const isStandardMaterial = (
	material: unknown
): material is THREE.MeshStandardMaterial =>
	material instanceof THREE.MeshStandardMaterial

export const isTexture = (file: unknown): file is THREE.Texture =>
	file instanceof THREE.Texture
