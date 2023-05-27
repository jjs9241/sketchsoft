import * as THREE from "three"
import { useRef, useEffect } from "react"
import { addBox, addRandomSphere, initRenderer } from "../module/renderer.module"

const CanvasContainer = () => {
	console.log('CanvasContainer')

	const { renderer, scene } = initRenderer()
	
	const rendererRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setTimeout(() => {
			rendererRef.current!.appendChild(renderer.domElement)
			addRandomSphere(scene)
		}, 0)
	}, [])

	return (
		<div ref={rendererRef}></div>
	)
}

export default CanvasContainer