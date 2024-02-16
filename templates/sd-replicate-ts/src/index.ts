import { ssam } from "ssam";
import type { Sketch, SketchSettings } from "ssam";
import { loadImage } from "./utils";
import type { Prediction } from "replicate";

const version =
  // lucataco/sdxl-lcm
  "fbbd475b1084de80c47c35bfe4ae64b964294aa7e237e6537eed938cfd24903d";

const sketch: Sketch<"2d"> = ({
  wrap,
  canvas,
  context: ctx,
  width,
  height,
  render,
}) => {
  let output: HTMLImageElement[] = [];

  const getPrediction = async (prediction: Prediction) => {
    console.log(prediction);
    output = await Promise.all(
      prediction.output.map(async (url: string) => await loadImage(url)),
    );
    render();
  };

  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
    import.meta.hot.on("ssam:replicate-prediction", getPrediction);
  }

  const runModel = (ev: KeyboardEvent) => {
    if (!(ev.metaKey || ev.ctrlKey || ev.shiftKey) && ev.key === "g") {
      const payload = {
        dryRun: true,
        version,
        input: {
          prompt: "Abstract sculpture made with ceramic",
          negative_prompt: "",
          image: canvas.toDataURL(),
          width,
          height,
          num_outputs: 1,
          num_inference_steps: 6,
          guidance_scale: 2,
          prompt_strength: 0.8,
          seed: (Math.random() * 100000000) | 0,
        },
      };
      import.meta.hot &&
        import.meta.hot.send("ssam:replicate-predict", payload);
    }
  };

  window.addEventListener("keydown", runModel);

  wrap.render = ({ width, height }) => {
    ctx.fillStyle = `brown`;
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.ellipse(400, 500, 400, 280, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `white`;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(670, 500, 300, 200, 2.3, 0, Math.PI * 2);
    ctx.fillStyle = `black`;
    ctx.fill();

    if (output[0]) {
      ctx.drawImage(output[0], 0, 0, width, height);
    }
  };

  wrap.unload = () => {
    window.removeEventListener("keydown", runModel);
    if (import.meta.hot) {
      import.meta.hot.off("ssam:replicate-prediction", getPrediction);
    }
  };
};

const settings: SketchSettings = {
  mode: "2d",
  dimensions: [1024, 1024],
  animate: false,
  duration: 4_000,
  playFps: 60,
  exportFps: 60,
  framesFormat: ["webm"],
};

ssam(sketch, settings);
