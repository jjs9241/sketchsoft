import * as THREE from 'three';
import { getRandomNumber } from './calculator.module';

export const initRenderer = () => {
	const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;

	const scene = new THREE.Scene();

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xffffff, 0);
	renderer.setSize( window.innerWidth, window.innerHeight );

	function animation( time: number ) {

		renderer.render( scene, camera );
	
	}
	renderer.setAnimationLoop( animation );

	return { renderer, scene }
}

export const addBox = (scene: THREE.Scene) => {
	const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	const material = new THREE.MeshNormalMaterial();

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}

export const addSphere = (scene: THREE.Scene) => {
	const geometry = new THREE.SphereGeometry( 0.2, 32, 16 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	const sphere = new THREE.Mesh( geometry, material ); 
	scene.add( sphere );
}

export const addRandomSphere = (scene: THREE.Scene) => {
	const radius = getRandomNumber(0.1, 0.5)
	const [ x, y, z ] = [1, 1, 1].map(one => getRandomNumber(-1, 1))
	
	const geometry = new THREE.SphereGeometry( radius, 32, 16 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
	
	const sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x, y, z)
	
	scene.add( sphere );
}