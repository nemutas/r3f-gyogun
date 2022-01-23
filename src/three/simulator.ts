import * as THREE from 'three';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { clampedRandom } from '../modules/utils';
import { positionFragmentShader } from './glsl/shader';

export class Simulator {
	private _gpuCompute
	private _variables: Variable[] = []
	private _positionMaterial = new THREE.ShaderMaterial()

	constructor(gl: THREE.WebGLRenderer, private _width: number, private _height: number) {
		this._gpuCompute = new GPUComputationRenderer(this._width, this._height, gl)
		this._setTexturePosition()
		this._setVariableDependencies()
		this._gpuCompute.init()
	}

	private _setTexturePosition = () => {
		// set the default position to texture
		const texture = this._gpuCompute.createTexture()
		const theArray = texture.image.data

		for (let i = 0; i < theArray.length; i += 4) {
			const x = clampedRandom(-3, 3)
			const y = clampedRandom(-3, 3)
			const z = clampedRandom(-3, 3)
			const w = clampedRandom(0.3, 1)

			theArray[i + 0] = x
			theArray[i + 1] = y
			theArray[i + 2] = z
			theArray[i + 3] = w
		}

		// set fragment shader
		const variable = this._gpuCompute.addVariable('texturePosition', positionFragmentShader, texture)
		variable.wrapS = THREE.RepeatWrapping
		variable.wrapT = THREE.RepeatWrapping

		// set uniforms
		this._positionMaterial = variable.material
		this._positionMaterial.uniforms['u_defaultTexture'] = { value: texture.clone() }
		this._positionMaterial.uniforms['u_time'] = { value: 0 }

		// add variable
		this._variables.push(variable)
	}

	private _setVariableDependencies = () => {
		this._variables.forEach(variable => {
			this._gpuCompute.setVariableDependencies(variable, this._variables)
		})
		// it means.
		// this._gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable, ...])
		// this._gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable, ...])
	}

	compute = () => {
		this._gpuCompute.compute()
		this._positionMaterial.uniforms.u_time.value += 0.005
	}

	get texturePosition() {
		const variable = this._variables.find(v => v.name === 'texturePosition')!
		const target = this._gpuCompute.getCurrentRenderTarget(variable) as THREE.WebGLRenderTarget
		return target.texture
	}

	get texturePrevPosition() {
		const variable = this._variables.find(v => v.name === 'texturePosition')!
		const target = this._gpuCompute.getAlternateRenderTarget(variable) as THREE.WebGLRenderTarget
		return target.texture
	}
}
