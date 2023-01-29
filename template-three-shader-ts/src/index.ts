import { Sketch, SketchSettings, ssam, WebGLProps } from "ssam";
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import baseVert from "./shaders/base.vert";
import baseFrag from "./shaders/base.frag";

const sketch = ({ wrap, canvas, width, height, pixelRatio }: WebGLProps) => {
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(width, height);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0xffffff, 1);

  const camera = new OrthographicCamera(-1, 1, 1 - 1, 0, 1);
  const scene = new Scene();

  const geometry = new PlaneGeometry(2, 2);
  const uniforms = {
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
    renderer.setSize(width, height);
  };
};

const settings: SketchSettings = {
  mode: "webgl2",
  // dimensions: [600, 600],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 2_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
  attributes: {
    preserveDrawingBuffer: true,
  },
};

ssam(sketch as Sketch, settings);
