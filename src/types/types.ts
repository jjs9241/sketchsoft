export interface Sphere {
	key: string
	position: [number, number, number]
	radius: number
	color: number
	index: number | undefined
}

export interface InstancedSphereState {
	instancedSphere: THREE.InstancedMesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>
	issuedIndexSet: Set<number>
	maxCount: number
	count: number
}

export interface Picker {
	rayCaster: THREE.Raycaster
	mouse: THREE.Vector2
	pickedId: number | undefined
	selectedId: number | undefined
	rotateQueue: {key: string, index: number}[]
}