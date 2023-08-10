// Three.js Built-in uniforms and attributes
// (these are only a few unconditional ones)
// https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram
// uniform mat4 viewMatrix;
// uniform vec3 cameraPosition;

precision highp float;

// #include "../../lygia/sdf/circleSDF.glsl"

uniform float time;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.0), 1.0);
}
