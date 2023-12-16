import { ssam } from "ssam";

/** @param {import("ssam").SketchProps} props */
const sketch = ({ wrap, context: ctx }) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  wrap.render = ({ width, height }) => {
    ctx.fillStyle = `gray`;
    ctx.fillRect(0, 0, width, height);
  };

  wrap.resize = ({ width, height }) => {
    //
  };
};

/** @type {import("ssam").SketchSettings} */
const settings = {
  mode: "2d",
  dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 4000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
};

ssam(sketch, settings);
