// --------------------------------------------------------
// Reference
// https://codesandbox.io/s/volumetric-light-w633u
// --------------------------------------------------------

import { useMemo, useRef, VFC } from 'react';
import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { extend, useFrame } from '@react-three/fiber';
import { GUIController } from '../store/gui';
import { VolumetricLightState } from '../store/state';

extend({ ShaderPass })

export const VolumetricLightPass: VFC = () => {
	// set controller
	GUIController.instance.setVolumetricLight()

	const passRef = useRef<ShaderPass>(null)

	const shader: THREE.Shader = useMemo(() => {
		return {
			uniforms: {
				tDiffuse: { value: null },
				u_lightPosition: { value: [0.5, 0.5] },
				u_exposure: { value: VolumetricLightState.exposure },
				u_decay: { value: VolumetricLightState.decay },
				u_density: { value: VolumetricLightState.density },
				u_weight: { value: VolumetricLightState.weight },
				u_samples: { value: VolumetricLightState.samples }
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		}
	}, [])

	useFrame(() => {
		passRef.current!.enabled = VolumetricLightState.enabled
		passRef.current!.uniforms.u_exposure.value = VolumetricLightState.exposure
		passRef.current!.uniforms.u_decay.value = VolumetricLightState.decay
		passRef.current!.uniforms.u_density.value = VolumetricLightState.density
		passRef.current!.uniforms.u_weight.value = VolumetricLightState.weight
		passRef.current!.uniforms.u_samples.value = VolumetricLightState.samples
	})

	return <shaderPass ref={passRef} attachArray="passes" args={[shader]} />
}

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform sampler2D tDiffuse;
uniform vec2 u_lightPosition;
uniform float u_exposure;
uniform float u_decay;
uniform float u_density;
uniform float u_weight;
uniform int u_samples;
varying vec2 v_uv;

const int MAX_SAMPLES = 100;

void main() {
  vec2 texCoord = v_uv;
  vec2 deltaTextCoord = texCoord - u_lightPosition;
  vec4 color = texture2D(tDiffuse, texCoord);
  deltaTextCoord *= 1.0 / float(u_samples) * u_density;
  float illuminationDecay = 1.0;

  for(int i = 0; i < MAX_SAMPLES; i++) {
    if(i == u_samples) break;
    texCoord -= deltaTextCoord;
    vec4 tex = texture2D(tDiffuse, texCoord);
    tex *= illuminationDecay * u_weight;
    color += tex;
    illuminationDecay *= u_decay;
  }

  gl_FragColor = color * u_exposure;
}
`
