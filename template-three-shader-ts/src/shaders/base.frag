varying vec2 vUv;

uniform vec2 resolution;
uniform float time;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float aspect = resolution.x / resolution.y;
  p.x *= aspect;
  
  gl_FragColor = vec4(vec3(1.0 - length(p)), 1.0);
}