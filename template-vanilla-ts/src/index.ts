import { Sketch, SketchProps, SketchSettings, ssam } from "ssam";

const sketch = ({ wrap, context: ctx }: SketchProps) => {
  wrap.render = ({ width, height }: SketchProps) => {
    ctx.fillStyle = `gray`;
    ctx.fillRect(0, 0, width, height);
  };

  wrap.resize = () => {
    //
  };
};

const settings: SketchSettings = {
  mode: "2d",
  dimensions: [600, 600],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 4000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
};

ssam(sketch as Sketch, settings);
