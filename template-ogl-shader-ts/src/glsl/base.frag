precision highp float;

uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 col = vec3(vUv, 0.5);
  gl_FragColor = vec4(col, 1.0);
}