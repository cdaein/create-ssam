import { Sketch, SketchSettings, ssam, WebGLProps } from "ssam";
import * as THREE from "three";

const sketch = ({ wrap, canvas, gl }: WebGLProps) => {
  wrap.render = ({ width, height }: WebGLProps) => {
    //
  };

  wrap.resize = ({ width, height }: WebGLProps) => {
    //
  };
};

const settings: SketchSettings = {
  mode: "webgl2",
  dimensions: [600, 600],
  animate: true,
  duration: 4000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
};

ssam(sketch as Sketch, settings);
