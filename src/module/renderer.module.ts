import * as THREE from 'three';
import { getRandomNumber } from './calculator.module';
import { InstancedSphereState, Sphere } from '../types/types';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const dummy = new THREE.Object3D();
const color = new THREE.Color();
const vector3 = new THREE.Vector3();

export const getNormalizeVector = (vector: [number, number, number]) => {
	vector3.x = vector[0]
	vector3.y = vector[1]
	vector3.z = vector[2]
	return vector3.normalize()
}

export const getDummyVector = () => {
	return vector3
}

export const getDummyMatrix = (scale: number, position: [number, number, number]) => {
	dummy.scale.x = scale
	dummy.scale.y = scale
	dummy.scale.z = scale
	
	dummy.position.set(position[0], position[1], position[2])
	dummy.updateMatrix()
	return dummy.matrix
}

export const initRenderer = () => {
	console.log('initRenderer')
	const camera = new THREE.PerspectiveCamera( 35, 1, 0.1, 600 );
	camera.position.z = 500;
	camera.lookAt(0,0,0)
	camera.updateProjectionMatrix()

	const scene = new THREE.Scene();

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor( 0xffffff, 0);
	//renderer.setSize( window.innerWidth, window.innerHeight );

	const controls = new OrbitControls( camera, renderer.domElement )

	return { camera, renderer, scene, controls }
}

export const addBox = (scene: THREE.Scene) => {
	const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	const material = new THREE.MeshNormalMaterial();

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}

export const addSphere = (scene: THREE.Scene) => {
	const geometry = new THREE.SphereGeometry( 0.2, 32, 16 ); 
	const material = new THREE.MeshPhongMaterial( { color: 0xffffff } ); 
	const sphere = new THREE.Mesh( geometry, material ); 
	scene.add( sphere );
}

const invisibleRadius = 0.0001

export const initInstancedSphere = (scene: THREE.Scene): InstancedSphereState => {
	const geometry = new THREE.SphereGeometry( invisibleRadius, 32, 16 ); 
	const material = new THREE.MeshPhongMaterial({ color: 0xffffff } ); 
	
	const maxCount = 10000
	const instancedSphere = new THREE.InstancedMesh( geometry, material, maxCount );
	instancedSphere.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

	const indexSet = new Set<number>()
	const matrix = getDummyMatrix(0, [0,0,0])
	for(let i = 0; i < maxCount; i++) {
		instancedSphere.setMatrixAt(i, matrix)
		color.setHex(0xffffff)
		instancedSphere.setColorAt(i, color)
		indexSet.add(i)
	}
	instancedSphere.instanceMatrix.needsUpdate = true;
	if(instancedSphere.instanceColor !== null) instancedSphere.instanceColor.needsUpdate = true
	
	scene.add(instancedSphere)
	return { instancedSphere, issuedIndexSet: new Set<number>(), maxCount: maxCount, count: 0 }
}

export const issueSphereIndex = (instancedSphere: InstancedSphereState): boolean => {
	if(instancedSphere.issuedIndexSet.size === 0){
		if(instancedSphere.count === instancedSphere.maxCount) {
			return false
		}
		instancedSphere.issuedIndexSet.add(instancedSphere.count)
		instancedSphere.count += 1
	}
	return true
}

export const createRandomSphere = (): Sphere => {
	const radius = getRandomNumber(10, 30)
	const [ x, y, z ] = [1, 1, 1].map(_ => getRandomNumber(-100, 100))
	const color = Math.random() * 0xffffff
	
	return {
		key: (new Date()).getTime().toString(),
		position: [x, y, z],
		radius: radius,
		color: color,
		index: undefined
	}
}

export const drawSphere = (instancedSphere: InstancedSphereState, sphere: Sphere) => {
	const radius = sphere.radius
	const [ x, y, z ] = [...sphere.position]
	
	const matrix = getDummyMatrix(radius / invisibleRadius, [x, y, z])

	if(sphere.index !== undefined) {
		instancedSphere.instancedSphere.setMatrixAt(sphere.index, matrix)
		color.setHex(sphere.color)
		instancedSphere.instancedSphere.setColorAt(sphere.index, color)
		if(instancedSphere.instancedSphere.instanceColor !== null) instancedSphere.instancedSphere.instanceColor.needsUpdate = true
	}
	
}

export const addSpotLight = (scene: THREE.Scene) => {
	const light = new THREE.SpotLight(0xffffff);
	light.position.set(100, 1000, 100);
	light.castShadow = false;
	scene.add(light);
}

export const addDirectionalLight = (scene: THREE.Scene) => {
	const intensity = 8;
	const light = new THREE.DirectionalLight( 0xffffff, intensity);
	light.position.set(-200, 200, 200 );
	scene.add(light)
}

export const addAmbientLight = (scene: THREE.Scene) => {
	const light = new THREE.AmbientLight( 0xffffff, 3 );
	scene.add(light);
}