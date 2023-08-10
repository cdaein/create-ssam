precision highp float;

// #include "../../lygia/sdf/circleSDF.glsl"

uniform float time;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.0), 1.0);
}
