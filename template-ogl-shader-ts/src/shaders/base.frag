precision highp float;

uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float aspect = uResolution.x / uResolution.y;
  p.x *= aspect;

  vec3 col = vec3(p, sin(uTime) * 0.5 + 0.5);
  gl_FragColor = vec4(col, 1.0);
}