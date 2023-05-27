import * as THREE from "three"
import { useRef, useEffect } from "react"
import { addBox, addSphere, initRenderer } from "../module/renderer.module"

const CanvasContainer = () => {
	console.log('CanvasContainer')

	const { renderer, scene } = initRenderer()
	
	const rendererRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setTimeout(() => {
			rendererRef.current!.appendChild(renderer.domElement)
			addSphere(scene)
		}, 0)
	},[])

	return (
		<div ref={rendererRef}></div>
	)
}

export default CanvasContainer