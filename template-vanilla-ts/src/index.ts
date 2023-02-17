import { ssam } from "ssam";
import type { Sketch, SketchProps, SketchSettings } from "ssam";

const sketch = ({ wrap, canvas, context: ctx }: SketchProps) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
    import.meta.hot.on("ssam:timelapse-changed", () => {
      import.meta.hot?.send("ssam:timelapse-newframe", {
        image: canvas.toDataURL(),
      });
    });
  }

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
  dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  duration: 4_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
};

ssam(sketch as Sketch, settings);
