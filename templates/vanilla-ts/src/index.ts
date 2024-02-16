import { ssam } from "ssam";
import type { Sketch, SketchSettings } from "ssam";

const sketch: Sketch<"2d"> = ({ wrap, context: ctx }) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  wrap.render = ({ width, height }) => {
    ctx.fillStyle = `gray`;
    ctx.fillRect(0, 0, width, height);
  };

  wrap.resize = () => {
    //
  };
};

const settings: SketchSettings = {
  mode: "2d",
  dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 4_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
};

ssam(sketch, settings);
