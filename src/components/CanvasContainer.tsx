import * as THREE from "three"
import { useRef, useEffect } from "react"
import { addBox, addRandomSphere, initRenderer, addDirectionalLight, addAmbientLight } from "../module/renderer.module"

const CanvasContainer = () => {
	console.log('CanvasContainer')

	const { camera, renderer, scene } = initRenderer()
	
	const rendererRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setTimeout(() => {
			rendererRef.current!.appendChild(renderer.domElement)
			// scene.add(new THREE.AxesHelper(20))
			addRandomSphere(scene)
			addAmbientLight(scene)
			addDirectionalLight(scene)
			
		}, 0)
	}, [])

	return (
		<div ref={rendererRef}></div>
	)
}

export default CanvasContainer