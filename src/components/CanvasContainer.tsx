import * as THREE from "three"
import { useRef, useEffect, useState } from "react"
import { drawSphere, issueSphereIndex, createRandomSphere, initRenderer, addDirectionalLight, addAmbientLight, initInstancedSphere } from "../module/renderer.module"
import { InstancedSphereState, Sphere } from "../types/geometry"

//import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CanvasContainer = () => {
	console.log('CanvasContainer')

	const rendererStateRef = useRef<{
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
	} | null>(null)
	
	const canvasContainerRef = useRef<HTMLDivElement | null>(null)
	const instancedSphereStateRef = useRef<InstancedSphereState | null>(null)
	const sphereContextRef = useRef<Sphere[] | null>(null)
	
	const storeSphere = (sphere: Sphere) => {
		if(sphereContextRef.current === null) return undefined
		if(sphereContextRef.current !== null && sphereContextRef.current.find(sphere0 => sphere0.key === sphere.key) !== undefined) return
		if(sphereContextRef.current !== null) sphereContextRef.current.push(sphere)
	}

	const animation = (time1: number) => {
		requestAnimationFrame( animation )
		if(rendererStateRef.current !== null){
			const rendererState = rendererStateRef.current

			if(sphereContextRef.current !== null && instancedSphereStateRef.current !== null){
				for(const sphere of sphereContextRef.current){
					console.log(sphere.key)
					drawSphere(instancedSphereStateRef.current, sphere)
				}
				instancedSphereStateRef.current.instancedSphere.instanceMatrix.needsUpdate = true
				//if(instancedSphereStateRef.current.instancedSphere.instanceColor !== null) instancedSphereStateRef.current.instancedSphere.instanceColor.needsUpdate = true
			}

			rendererState.renderer.render(rendererState.scene, rendererState.camera)
		}
	}

	const onClickAdd = () => {
		if(rendererStateRef.current !== null && instancedSphereStateRef.current !== null){
			const sphere = createRandomSphere()
			if(issueSphereIndex(instancedSphereStateRef.current)){
				const index = instancedSphereStateRef.current.issuedIndexSet.values().next().value as number
				const newSphere = {...sphere, index: index}
				//drawSphere(instancedSphereStateRef.current, newSphere)
				instancedSphereStateRef.current.issuedIndexSet.delete(index)
				//rendererStateRef.current.scene.add(instancedSphereStateRef.current.instancedSphere)
				storeSphere(newSphere)
			}
		}
	}

	useEffect(() => {
		setTimeout(() => {
			// const rect = rendererRef.current?.getBoundingClientRect()
			if(rendererStateRef.current === null) rendererStateRef.current = initRenderer()
			if(rendererStateRef.current !== null) animation(1)
			if(instancedSphereStateRef.current === null) instancedSphereStateRef.current = initInstancedSphere(rendererStateRef.current.scene)
			if(sphereContextRef.current === null) sphereContextRef.current = []
			
			rendererStateRef.current.renderer.setSize(503, 503)
			rendererStateRef.current.camera.aspect = 1;
			rendererStateRef.current.renderer.domElement.style.borderStyle = "solid"
			rendererStateRef.current.renderer.domElement.style.borderColor = "red"

			// const controls = new OrbitControls( rendererStateRef.current.camera, rendererStateRef.current.renderer.domElement );
			// controls.enableDamping = true;
			// controls.enableZoom = true;
			// controls.enablePan = false;

			//const stats = new Stats();
			//canvasContainerRef.current!.appendChild( stats.dom );
			
			canvasContainerRef.current!.appendChild(rendererStateRef.current.renderer.domElement)
			
			// scene.add(new THREE.AxesHelper(20))
			addAmbientLight(rendererStateRef.current.scene)
			addDirectionalLight(rendererStateRef.current.scene)
		}, 0)
	}, [])

	return (
		<div ref={canvasContainerRef} style={{position: "relative"}}>
			<button style={{zIndex: 1, width: "90px", height: "30px", margin: "-45px 0 0 -45px", position: "absolute", top: "90%", left: "50%", color: "white", backgroundColor: "blue", borderRadius: "10px"}}
				onClick={() => {
					console.log("add button clicked")
					onClickAdd()
				}}
			>+ Add</button>
		</div>
	)
}

export default CanvasContainer