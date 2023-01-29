import { Sketch, WebGLProps, SketchSettings, ssam } from "ssam";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import baseVert from "./glsl/base.vert";
import baseFrag from "./glsl/base.frag";

const sketch = ({ wrap, canvas, width, height, pixelRatio }: WebGLProps) => {
  const renderer = new Renderer({
    canvas,
    width,
    height,
    dpr: pixelRatio,
  });
  const gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: baseVert,
    fragment: baseFrag,
    uniforms: {
      uTime: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  wrap.render = ({ playhead }: WebGLProps) => {
    program.uniforms.uTime.value = playhead * Math.PI * 2;

    renderer.render({ scene: mesh });
  };

  wrap.resize = ({ width, height }: WebGLProps) => {
    renderer.setSize(width, height);
  };
};

const settings: SketchSettings = {
  mode: "webgl2",
  dimensions: [600, 600],
  animate: true,
  duration: 4_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
  attributes: {
    preserveDrawingBuffer: true,
  },
};

ssam(sketch as Sketch, settings);
