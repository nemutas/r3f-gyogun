import React, { useRef, VFC } from 'react';
import * as THREE from 'three';
import { Icosahedron, OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { InstancedBox } from './InstancedBox';
import { Effects } from './postprocessing/Effects';
import { VolumetricLightPass } from './postprocessing/VolumetricLightPass';
import { GUIController } from './store/gui';
import { LightState } from './store/state';

export const TCanvas: VFC = () => {
	return (
		<Canvas
			camera={{
				position: [0, 0, 15],
				fov: 50,
				aspect: window.innerWidth / window.innerHeight,
				near: 0.01,
				far: 2000
			}}
			dpr={window.devicePixelRatio}
			shadows>
			<color attach="background" args={['#000']} />
			{/* objects */}
			<LightMesh />
			<InstancedBox />
			{/* postprocessing */}
			<Effects>
				<VolumetricLightPass />
			</Effects>
			{/* helpers */}
			<OrbitControls />
			<Stats />
		</Canvas>
	)
}

const LightMesh: VFC = () => {
	const meshRef = useRef<THREE.Mesh>(null)

	GUIController.instance.setLight()

	useFrame(() => {
		;(meshRef.current!.material as THREE.MeshBasicMaterial).color = new THREE.Color(LightState.color)
	})

	return (
		<Icosahedron ref={meshRef} args={[2, 10]}>
			<meshBasicMaterial color={LightState.color} />
		</Icosahedron>
	)
}
