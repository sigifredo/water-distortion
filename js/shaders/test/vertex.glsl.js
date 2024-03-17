export default /* glsl */`

uniform float u_time;

varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_uv;

void main() {
	v_position = position;
	v_normal = normal;
	v_uv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
