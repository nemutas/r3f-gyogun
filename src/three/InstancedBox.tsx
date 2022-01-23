import React, { useEffect, useMemo, useRef, VFC } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { fragmentShader, vertexShader } from './glsl/shader';
import { Simulator } from './simulator';
import { GUIController } from './store/gui';
import { BoxState, LightState } from './store/state';

export const InstancedBox: VFC = () => {
	const meshRef = useRef<THREE.InstancedMesh>(null)
	const { gl } = useThree()

	// plane amount
	const [width, height] = [128, 128]
	const amount = width * height

	// gpgpu simulator
	const simulator = useMemo(() => new Simulator(gl, width, height), [gl, height, width])

	// uv to access simulator texture
	const reference = useMemo(() => {
		const ref = []
		for (let iw = 0; iw < width; iw++) {
			for (let ih = 0; ih < height; ih++) {
				ref.push(iw / width, ih / height)
			}
		}
		return Float32Array.from(ref)
	}, [height, width])

	// default position (dummy)
	useEffect(() => {
		const matrix = new THREE.Matrix4()

		for (let i = 0; i < amount; i++) {
			matrix.setPosition(0, 0, 0)
			meshRef.current!.setMatrixAt(i, matrix)
		}
	}, [amount])

	// shader
	const shader: THREE.Shader = {
		uniforms: {
			u_light: { value: [0, 0, 0] },
			u_lightColor: { value: new THREE.Color(LightState.color) },
			u_boxScale: { value: [BoxState.x, BoxState.y, BoxState.z] },
			u_texturePosition: { value: null },
			u_texturePrevPosition: { value: null }
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	}

	// set controller
	GUIController.instance.setBox()

	useFrame(() => {
		simulator.compute()
		shader.uniforms.u_texturePosition.value = simulator.texturePosition
		shader.uniforms.u_texturePrevPosition.value = simulator.texturePrevPosition
		shader.uniforms.u_boxScale.value = [BoxState.x, BoxState.y, BoxState.z]
		shader.uniforms.u_lightColor.value = new THREE.Color(LightState.color)
	})

	return (
		<instancedMesh ref={meshRef} args={[undefined, undefined, amount]} castShadow receiveShadow>
			<boxGeometry args={[1, 1, 1]}>
				<instancedBufferAttribute attachObject={['attributes', 'a_ref']} args={[reference, 2]} />
			</boxGeometry>
			<shaderMaterial args={[shader]} />
		</instancedMesh>
	)
}
