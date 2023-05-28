import * as THREE from 'three';
import { getRandomNumber } from './calculator.module';
import { Sphere } from '../types/geometry';

export const initRenderer = () => {
	console.log('initRenderer')
	const camera = new THREE.PerspectiveCamera( 35, 1, 200, 500 );
	camera.position.z = 400;
	camera.lookAt(0,0,0)

	const scene = new THREE.Scene();

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xffffff, 0);
	//renderer.setSize( window.innerWidth, window.innerHeight );

	function animation( time: number ) {

		renderer.render( scene, camera );
	
	}
	renderer.setAnimationLoop( animation );

	return { camera, renderer, scene }
}

export const addBox = (scene: THREE.Scene) => {
	const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	const material = new THREE.MeshNormalMaterial();

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}

export const addSphere = (scene: THREE.Scene) => {
	const geometry = new THREE.SphereGeometry( 0.2, 32, 16 ); 
	const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } ); 
	const sphere = new THREE.Mesh( geometry, material ); 
	scene.add( sphere );
}

export const addRandomSphere = (scene: THREE.Scene, addSphere: (sphere0: Sphere) => void) => {
	const radius = getRandomNumber(10, 30)
	const [ x, y, z ] = [1, 1, 1].map(_ => getRandomNumber(-100, 100))
	
	const geometry = new THREE.SphereGeometry( radius, 32, 16 ); 
	const material = new THREE.MeshPhongMaterial( { color: Math.round(Math.random() * 0xffffff) } ); 
	
	const sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x, y, z)
	
	scene.add( sphere );
	addSphere({
		key: (new Date()).getTime().toString(),
		position: [x, y, z],
		radius: radius
	})
}

export const addSpotLight = (scene: THREE.Scene) => {
	const light = new THREE.SpotLight(0xffffff);
	light.position.set(100, 1000, 100);
	light.castShadow = false;
	scene.add(light);
}

export const addDirectionalLight = (scene: THREE.Scene) => {
	const intensity = 12;
	const light = new THREE.DirectionalLight( 0xffffff, intensity);
	light.position.set(-200, 200, 200 );
	scene.add(light)
}

export const addAmbientLight = (scene: THREE.Scene) => {
	const light = new THREE.AmbientLight( 0xffffff, 3 );
	scene.add(light);
}