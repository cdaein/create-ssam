import { ssam } from "ssam";
import type { Sketch, WebGLProps, SketchSettings } from "ssam";
import { BoxGeometry, Mesh, PerspectiveCamera, Scene, ShaderMaterial, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import vert from "./shaders/vert.glsl";
import frag from "./shaders/frag.glsl";

const sketch = ({ wrap, canvas, width, height, pixelRatio }: WebGLProps) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(width, height);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0xffffff, 1);

  const camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(1, 2, 3);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);

  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const scene = new Scene();

  const geometry = new BoxGeometry(1, 1, 1);
  const uniforms = {
    time: { value: 0.0 },
  };
  const material = new ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  wrap.render = ({ playhead }: WebGLProps) => {
    uniforms["time"].value = playhead * Math.PI * 2;

    controls.update();
    stats.update();
    renderer.render(scene, camera);
  };

  wrap.resize = ({ width, height }: WebGLProps) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  wrap.unload = () => {
    renderer.dispose();
    renderer.forceContextLoss();
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
