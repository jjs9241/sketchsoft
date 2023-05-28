import * as THREE from "three"
import { useRef, useEffect, useState } from "react"
import { addRandomSphere, initRenderer, addDirectionalLight, addAmbientLight } from "../module/renderer.module"
import { Sphere } from "../types/geometry"

const CanvasContainer = () => {
	console.log('CanvasContainer')

	const rendererStateRef = useRef<{
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
	} | null>(null)
	
	const canvasContainerRef = useRef<HTMLDivElement>(null)

	const [sphereStore, setSphereStore] = useState<Sphere[]>([])
	
	const storeSphere = (sphere: Sphere) => {
		if(sphereStore.find(sphere0 => sphere0.key === sphere.key) !== undefined) return
		setSphereStore([...sphereStore, sphere])
	}

	const onClickAdd = () => {
		if(rendererStateRef.current !== null) addRandomSphere(rendererStateRef.current.scene, storeSphere)
	}

	useEffect(() => {
		setTimeout(() => {
			console.log('init canvas')
			// const rect = rendererRef.current?.getBoundingClientRect()
			if(rendererStateRef.current === null) rendererStateRef.current = initRenderer()
			rendererStateRef.current.renderer.setSize(503, 503)
			rendererStateRef.current.camera.aspect = 1;
			rendererStateRef.current.renderer.domElement.style.borderStyle = "solid"
			rendererStateRef.current.renderer.domElement.style.borderColor = "red"
			canvasContainerRef.current!.appendChild(rendererStateRef.current.renderer.domElement)
			// scene.add(new THREE.AxesHelper(20))
			// addRandomSphere(scene, addSphere)
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