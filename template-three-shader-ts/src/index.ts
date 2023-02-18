import { ssam } from "ssam";
import type { Sketch, WebGLProps, SketchSettings } from "ssam";
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
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

  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(width, height);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0xffffff, 1);

  const camera = new OrthographicCamera(-1, 1, 1 - 1, 0, 1);
  const scene = new Scene();

  const geometry = new PlaneGeometry(2, 2);
  const uniforms = {
    resolution: { value: new Vector2(width, height) },
    time: { value: 0.0 },
  };
  const material = new ShaderMaterial({
    vertexShader: baseVert,
    fragmentShader: baseFrag,
    uniforms,
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  wrap.render = ({ playhead }: WebGLProps) => {
    uniforms["time"].value = playhead * Math.PI * 2;
    renderer.render(scene, camera);
  };

  wrap.resize = ({ width, height }: WebGLProps) => {
    uniforms["resolution"].value.set(width, height);
    renderer.setSize(width, height);
  };

  wrap.unload = () => {
    renderer.dispose();
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
