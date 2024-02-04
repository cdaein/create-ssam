import "vite/types/customEvent";
import type { Prediction } from "replicate";

type PredictPayload = {
  /**
   * set it to `false` when you're ready to send API request.
   * @default true
   */
  dryRun: boolean;
  /**
   * Find a model you'd like to use on Replicate.com and pass the model version string
   */
  version: string;
  /**
   * Different models take different input objects. Check the model page on the website.
   */
  input: {
    prompt: string;
    width?: number;
    height?: number;
    seed?: number;
    [key: string]: any;
  };
};

declare module "vite/types/customEvent" {
  interface CustomEventMap {
    "ssam:replicate-predict": PredictPayload;
    "ssam:replicate-prediction": Prediction;
  }
}
