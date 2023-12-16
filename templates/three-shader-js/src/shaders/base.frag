precision highp float;

#include "../../lygia/sdf/circleSDF.glsl"

uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float aspect = resolution.x / resolution.y;
  p.x *= aspect;

  float circ = circleSDF(p + vec2(0.5));

  vec3 col = vec3(p, sin(time) * 0.5 + 0.5);
  gl_FragColor = vec4(vec3(circ), 1.0);
}
