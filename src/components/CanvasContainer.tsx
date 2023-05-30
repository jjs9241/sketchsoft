import * as THREE from "three"
import { useRef, useEffect, useState } from "react"
import { drawSphere, issueSphereIndex, createRandomSphere, initRenderer, addDirectionalLight, addAmbientLight, initInstancedSphere, getDummyMatrix, getDummyVector, getNormalizeVector } from "../module/renderer.module"
import { InstancedSphereState, Sphere, Picker } from "../types/types"

//import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CanvasContainer = () => {
	console.log('CanvasContainer')

	const rendererStateRef = useRef<{
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
		controls: OrbitControls
	} | null>(null)
	
	const canvasContainerRef = useRef<HTMLDivElement | null>(null)
	const instancedSphereStateRef = useRef<InstancedSphereState | null>(null)
	const sphereContextRef = useRef<Sphere[] | null>(null)
	const pickerRef = useRef<Picker | null>(null)
	
	const storeSphere = (sphere: Sphere) => {
		if(sphereContextRef.current === null) return undefined
		if(sphereContextRef.current !== null && sphereContextRef.current.find(sphere0 => sphere0.key === sphere.key) !== undefined) return
		if(sphereContextRef.current !== null) sphereContextRef.current.push(sphere)
		if(instancedSphereStateRef.current !== null){
			drawSphere(instancedSphereStateRef.current, sphere)
			instancedSphereStateRef.current.instancedSphere.instanceMatrix.needsUpdate = true
			instancedSphereStateRef.current.instancedSphere.computeBoundingSphere()
		}
	}

	const cameraNormal = new THREE.Vector3(0, 0, 0);
	const cameraPosition = new THREE.Vector3(0, 0, 0);
	const spherePosition = new THREE.Vector3(0, 0, 0);
	const newPosition = new THREE.Vector3(0, 0, 0);
	const origin = new THREE.Vector3(0, 0, 0);
	const originToSphere = new THREE.Vector3(0, 0, 0);
	const originToCamera = new THREE.Vector3(0, 0, 0);
	const newLocalSphere = new THREE.Vector3(0, 0, 0);
	const quaternion = new THREE.Quaternion();
	const cameraLocalNormal = new THREE.Vector3(0, 0, 1);
	const rotationMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), Math.PI / 180);
	const dummyMatrix = new THREE.Matrix4()

	const animation = (time1: number) => {
		requestAnimationFrame( animation )
		if(rendererStateRef.current !== null){
			const rendererState = rendererStateRef.current

			rendererState.controls.update()

			pickerRef.current?.rayCaster.setFromCamera( pickerRef.current.mouse, rendererState.camera )
			const intersection = instancedSphereStateRef.current?.instancedSphere === undefined ? undefined : pickerRef.current?.rayCaster.intersectObject( instancedSphereStateRef.current.instancedSphere )

			if ( intersection !== undefined && intersection.length > 0) {
				if(pickerRef.current !== null) pickerRef.current.pickedId = intersection[0].instanceId
			} else {
				if(pickerRef.current !== null) pickerRef.current.pickedId = undefined
			}

			if(pickerRef.current !== null && sphereContextRef.current !== null && instancedSphereStateRef.current !== null){
				const popCount = pickerRef.current.rotateQueue.length > 10 ? 10 : pickerRef.current.rotateQueue.length
				for(let i = 0; i <  popCount ; i++){
					const event = pickerRef.current.rotateQueue.pop()
					if(event === undefined) break
					const found = sphereContextRef.current.find(shere => shere.key === event.key)
					if(found === undefined || found.index === undefined) break

					rendererStateRef.current.camera.getWorldDirection(cameraNormal)
					cameraNormal.normalize()
					cameraPosition.x = rendererStateRef.current.camera.position.x
					cameraPosition.y = rendererStateRef.current.camera.position.y
					cameraPosition.z = rendererStateRef.current.camera.position.z

					instancedSphereStateRef.current?.instancedSphere.getMatrixAt( found.index, dummyMatrix );
					spherePosition.setFromMatrixPosition( dummyMatrix )

					// spherePosition.x = event.spherePosition[0]
					// spherePosition.y = event.spherePosition[1]
					// spherePosition.z = event.spherePosition[2]
					
					const doted = cameraNormal.x * (spherePosition.x - cameraPosition.x) + cameraNormal.y * (spherePosition.y - cameraPosition.y) + cameraNormal.z * (spherePosition.z - cameraPosition.z)
					origin.x = cameraPosition.x + doted * cameraNormal.x
					origin.y = cameraPosition.y + doted * cameraNormal.y
					origin.z = cameraPosition.z + doted * cameraNormal.z

					newPosition.x = spherePosition.x - origin.x
					newPosition.y = spherePosition.y - origin.y
					newPosition.z = spherePosition.y - origin.z

					originToSphere.x = newPosition.x
					originToSphere.y = newPosition.y
					originToSphere.z = newPosition.z
					originToSphere.normalize()

					originToCamera.x = cameraPosition.x - origin.x
					originToCamera.y = cameraPosition.y - origin.y
					originToCamera.z = cameraPosition.z - origin.z
					originToCamera.normalize()
					
					quaternion.setFromUnitVectors(originToSphere, originToCamera)
					newPosition.applyQuaternion(quaternion)
					quaternion.setFromUnitVectors(cameraNormal, cameraLocalNormal)
					newPosition.applyQuaternion(quaternion)
					quaternion.setFromUnitVectors(originToCamera, originToSphere)
					newPosition.applyQuaternion(quaternion)
					newPosition.applyMatrix4(rotationMatrix)
					newLocalSphere.x = newPosition.x
					newLocalSphere.y = newPosition.y
					newLocalSphere.z = newPosition.z
					newLocalSphere.normalize()
					quaternion.setFromUnitVectors(newLocalSphere, cameraLocalNormal)
					newPosition.applyQuaternion(quaternion)
					quaternion.setFromUnitVectors(cameraLocalNormal, cameraNormal)
					newPosition.applyQuaternion(quaternion)
					quaternion.setFromUnitVectors(cameraLocalNormal, newLocalSphere)
					newPosition.applyQuaternion(quaternion)
					newPosition.x += origin.x
					newPosition.y += origin.y
					newPosition.z += origin.z
					
					dummyMatrix.setPosition( newPosition ) // 변경된 position 넣기
					
					instancedSphereStateRef.current.instancedSphere.setMatrixAt( found.index, dummyMatrix );
					instancedSphereStateRef.current.instancedSphere.instanceMatrix.needsUpdate = true;

				}
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
				instancedSphereStateRef.current.issuedIndexSet.delete(index)
				storeSphere(newSphere)
			}
		}
	}

	useEffect(() => {
		setTimeout(() => {
			// const rect = rendererRef.current?.getBoundingClientRect()
			if(rendererStateRef.current === null) {
				rendererStateRef.current = initRenderer()
				if(rendererStateRef.current !== null) animation(1)
				if(instancedSphereStateRef.current === null) instancedSphereStateRef.current = initInstancedSphere(rendererStateRef.current.scene)
				if(sphereContextRef.current === null) sphereContextRef.current = []
				
				rendererStateRef.current.renderer.setSize(503, 503)
				rendererStateRef.current.camera.aspect = 1;
				rendererStateRef.current.renderer.domElement.style.borderStyle = "solid"
				rendererStateRef.current.renderer.domElement.style.borderColor = "red"

				rendererStateRef.current.controls.enableDamping = true;
				rendererStateRef.current.controls.enableZoom = true;
				rendererStateRef.current.controls.enablePan = false;
				rendererStateRef.current.controls.maxDistance = 500
				rendererStateRef.current.controls.minDistance = -100
				
				// const stats = new Stats()
				// canvasContainerRef.current!.appendChild( stats.dom )
				
				canvasContainerRef.current!.appendChild(rendererStateRef.current.renderer.domElement)
				
				// scene.add(new THREE.AxesHelper(20))
				addAmbientLight(rendererStateRef.current.scene)
				addDirectionalLight(rendererStateRef.current.scene)

				pickerRef.current = {
					rayCaster: new THREE.Raycaster(),
					mouse: new THREE.Vector2( 1, 1 ),
					pickedId: undefined,
					selectedId: undefined,
					rotateQueue: []
				}

				canvasContainerRef.current?.addEventListener('mousemove', ( event ) =>  {

					event.preventDefault();
			
					if(canvasContainerRef.current === null) return;
					const rect = canvasContainerRef.current.getBoundingClientRect();
					if(pickerRef.current !== null){
						pickerRef.current.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
						pickerRef.current.mouse.y = ((rect.bottom - event.clientY) / rect.height ) * 2 - 1
					}
			
				})

				canvasContainerRef.current?.addEventListener('click', ( event ) =>  {

					event.preventDefault();
			
					if(pickerRef.current === null) return;
					
					if(pickerRef.current.selectedId !== undefined && sphereContextRef.current !== null){
						if(pickerRef.current.pickedId === pickerRef.current.selectedId){
							console.log('delete')
							const matrix = getDummyMatrix(0, [0,0,0])
							instancedSphereStateRef.current?.instancedSphere.setMatrixAt(pickerRef.current.selectedId, matrix)
							instancedSphereStateRef.current?.issuedIndexSet.add(pickerRef.current.selectedId)
							if(instancedSphereStateRef.current) instancedSphereStateRef.current.instancedSphere.instanceMatrix.needsUpdate = true;
						}
						else {
							console.log('deselect')
							const beforeSelected = sphereContextRef.current.find(sphere => sphere.index === pickerRef.current?.selectedId)
							if(beforeSelected && beforeSelected.index) instancedSphereStateRef.current?.instancedSphere.setColorAt( beforeSelected.index, new THREE.Color(beforeSelected.color) );
							pickerRef.current.selectedId = undefined
							pickerRef.current.rotateQueue = []
							if(pickerRef.current.pickedId !== undefined) {
								console.log('select')
								instancedSphereStateRef.current?.instancedSphere.setColorAt( pickerRef.current.pickedId, new THREE.Color(0xFF0000) )
								pickerRef.current.selectedId = pickerRef.current.pickedId
							}
							if(instancedSphereStateRef.current !== null && instancedSphereStateRef.current.instancedSphere.instanceColor !== null) instancedSphereStateRef.current.instancedSphere.instanceColor.needsUpdate = true;
						}
					} else {
						if(pickerRef.current.pickedId !== undefined) {
							console.log('select')
							instancedSphereStateRef.current?.instancedSphere.setColorAt( pickerRef.current.pickedId, new THREE.Color(0xFF0000) )
							pickerRef.current.selectedId = pickerRef.current.pickedId
							if(instancedSphereStateRef.current !== null && instancedSphereStateRef.current.instancedSphere.instanceColor !== null) instancedSphereStateRef.current.instancedSphere.instanceColor.needsUpdate = true;
						}
					}
					

				})

				window.addEventListener('keydown', ( event ) =>  {

					event.preventDefault();
			
					console.log(event)
					if(event.key === 'q' || event.key === 'Q' || event.key === 'w' || event.key === 'W' || event.key === 'a' || event.key === 'A' || event.key === 's' || event.key === 'S' || event.key === 'z' || event.key === 'Z' || event.key === 'x' || event.key === 'X'){
						if(pickerRef.current !== null && pickerRef.current.selectedId){

							const selectedSphere = sphereContextRef.current?.find(sphere => sphere.index === pickerRef.current?.selectedId)
							const selectedIndex = pickerRef.current?.selectedId
							if(selectedSphere !== undefined && instancedSphereStateRef.current !== null && sphereContextRef.current !== null){
								const addVector = [0, 0, 0] as [number, number, number]
								const translateUnit = 0.1
								if(event.key === 'q' || event.key === 'Q'){
									addVector[0] += translateUnit
								} else if( event.key === 'w' || event.key === 'W'){
									addVector[0] -= translateUnit
								} else if( event.key === 'a' || event.key === 'A'){
									addVector[1] += translateUnit
								} else if( event.key === 's' || event.key === 'S'){
									addVector[1] -= translateUnit
								} else if( event.key === 'z' || event.key === 'Z'){
									addVector[2] += translateUnit
								} else if( event.key === 'x' || event.key === 'X') {
									addVector[2] -= translateUnit
								}
								
								let matrix = new THREE.Matrix4();
								let position = new THREE.Vector3();
								instancedSphereStateRef.current?.instancedSphere.getMatrixAt( selectedIndex, matrix );
								position.setFromMatrixPosition( matrix )
								position.x += addVector[0]
								position.y += addVector[1]
								position.z += addVector[2]
								matrix.setPosition( position )
								instancedSphereStateRef.current.instancedSphere.setMatrixAt( selectedIndex, matrix );
								instancedSphereStateRef.current.instancedSphere.instanceMatrix.needsUpdate = true;

								const foundIndex = sphereContextRef.current.findIndex(sphere => sphere.key === selectedSphere.key)
								if(foundIndex !== -1){
									sphereContextRef.current[foundIndex] = {
										...selectedSphere,
										position: [position.x, position.x, position.x]
									}
								}
							}
						}
					} else if(event.key === 'r' || event.key === 'R'){
						if(pickerRef.current !== null && pickerRef.current.selectedId !== undefined && sphereContextRef.current !== null && rendererStateRef.current !== null) {
							const found = sphereContextRef.current.find(sphere => sphere.index === pickerRef.current?.selectedId)
							if(found !== undefined && found.index) pickerRef.current.rotateQueue.push({key: found.key, index: found.index})
						}
					}

				})
			}
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