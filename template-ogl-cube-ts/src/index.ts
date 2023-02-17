import { ssam } from "ssam";
import type { Sketch, WebGLProps, SketchSettings } from "ssam";
import {
  Box,
  Camera,
  Mesh,
  Orbit,
  Program,
  Renderer,
  TextureLoader,
  Transform,
  Vec3,
} from "ogl";
import baseVert from "./shaders/base.vert";
import baseFrag from "./shaders/base.frag";

const sketch = ({ wrap, canvas, width, height, pixelRatio }: WebGLProps) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
    import.meta.hot.on("ssam:timelapse-changed", () => {
      import.meta.hot?.send("ssam:timelapse-newframe", {
        image: canvas.toDataURL(),
      });
    });
  }

  const renderer = new Renderer({
    canvas,
    width,
    height,
    dpr: pixelRatio,
  });
  const gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);

  const camera = new Camera(gl, { fov: 50 });
  camera.position.set(-3, 2, 2);
  const controls = new Orbit(camera, {
    target: new Vec3(0, 0, 0),
  });

  const scene = new Transform();

  const texture = TextureLoader.load(gl, { src: "/texture.png" });
  const program = new Program(gl, {
    vertex: baseVert,
    fragment: baseFrag,
    uniforms: {
      tMap: { value: texture },
      uTime: { value: 0 },
    },
  });
  const geometry = new Box(gl);
  const mesh = new Mesh(gl, { geometry, program });
  mesh.setParent(scene);

  wrap.render = ({ playhead }: WebGLProps) => {
    program.uniforms.uTime.value = playhead * Math.PI * 2;

    controls.update();
    renderer.render({ scene, camera });
  };

  wrap.resize = ({ width, height }: WebGLProps) => {
    renderer.setSize(width, height);
    camera.perspective({ aspect: width / height });
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
