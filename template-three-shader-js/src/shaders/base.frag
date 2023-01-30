varying vec2 vUv;

uniform float time;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float col = 1.0 - length(p);
  
  gl_FragColor = vec4(vec3(col), 1.0);
}