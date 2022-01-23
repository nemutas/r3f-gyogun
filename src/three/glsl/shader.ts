import { curlNoise33 } from './noise';
import { quaternion } from './quaternion';

export const vertexShader = `
attribute vec2 a_ref;
uniform vec3 u_boxScale;
uniform sampler2D u_texturePosition;
uniform sampler2D u_texturePrevPosition;
varying vec3 v_pos;
varying vec3 v_normal;

const vec3 BASIC_VECTOR = normalize(vec3(0.0, 0.0, 1.0));

${quaternion}

void main() {
	vec4 positionInfo = texture2D(u_texturePosition, a_ref);
	vec4 prevPositionInfo = texture2D(u_texturePrevPosition, a_ref);
	vec3 pos = position;

	v_normal = normalize(normal);

	// ----------------------------------------------
	// 1. generate plane from 0 scale

	pos *= u_boxScale;
	pos *= clamp(1.0 - positionInfo.w, 0.0, 1.0);

	// ----------------------------------------------
	// 2. rotate using quaternion

	// calc rotate axis
	vec3 dir = normalize(positionInfo.xyz - prevPositionInfo.xyz);
	vec3 rotateAxis = normalize(cross(BASIC_VECTOR, dir));

	if (0.0 < length(rotateAxis)) {
		// calc angle
		float c = dot(BASIC_VECTOR, dir);
		float angle = acos(c);

		// rotate using Quaternion
		Quaternion q = axisAngle(rotateAxis, angle);
		pos = rotate(pos, q);
		v_normal = normalize(rotate(normal, q));
	}

	// ----------------------------------------------
	// 3. convert position to grobal from local

	vec4 globalPosition = instanceMatrix * vec4(pos, 1.0);
	vec3 gPos = positionInfo.xyz + globalPosition.xyz;

	vec4 mPos = modelMatrix * vec4(gPos, 1.0);
	v_pos = mPos.xyz;

	gl_Position = projectionMatrix * viewMatrix * mPos;
}
`

export const fragmentShader = `
uniform vec3 u_light;
uniform vec3 u_lightColor;
varying vec3 v_pos;
varying vec3 v_normal;

void main() {
	vec3 color = u_lightColor * 0.8;

	vec3 fromLight = v_pos - u_light;
	float d = 1.0 - (dot(v_normal, normalize(fromLight)) + 1.0) * 0.5; // 0 ~ 1
	color *= smoothstep(0.5, 0.8, d);

	float decay = 1.0 - smoothstep(5.0, 10.0, length(fromLight));
	color *= decay;

	gl_FragColor = vec4(color, 1.0);
}
`

export const positionFragmentShader = `
uniform float u_time;
uniform sampler2D u_defaultTexture;

const float divergence = 0.03;
const float dieSpeed = 0.99;

${curlNoise33}

void main()	{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 tmpPos = texture2D(texturePosition, uv);
	vec3 pos = tmpPos.xyz;
	float life = tmpPos.w;

	if (life < 0.01) {
		vec4 defPos = texture2D(u_defaultTexture, uv);
		pos = defPos.xyz;
		life = defPos.w + 1.0;
	}

	vec3 seed = sin(pos * 0.1 + u_time * 0.01) + u_time * 0.01;
	pos += curlNoise33(seed) * divergence;

	gl_FragColor = vec4(pos, life * dieSpeed);
}
`
