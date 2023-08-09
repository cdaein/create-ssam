import { ssam } from "ssam";
import type { Sketch, WebGLProps, SketchSettings } from "ssam";
import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";
import baseVert from "./shaders/base.vert";
import baseFrag from "./shaders/base.frag";

const sketch = ({ wrap, canvas, width, height, pixelRatio }: WebGLProps) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

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
      uResolution: { value: new Vec2(width, height) },
      uTime: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  wrap.render = ({ playhead }: WebGLProps) => {
    program.uniforms.uTime.value = playhead * Math.PI * 2;

    renderer.render({ scene: mesh });
  };

  wrap.resize = ({ width, height }: WebGLProps) => {
    program.uniforms.uResolution.value.set(width, height);
    renderer.setSize(width, height);
  };

  wrap.unload = () => {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
};

const settings: SketchSettings = {
  mode: "webgl2",
  // dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 6_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
  attributes: {
    preserveDrawingBuffer: true,
  },
};

ssam(sketch as Sketch, settings);
