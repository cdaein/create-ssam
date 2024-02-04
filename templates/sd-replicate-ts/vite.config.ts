import { defineConfig, loadEnv } from "vite";
import { ssamExport } from "vite-plugin-ssam-export";
import { ssamFfmpeg } from "vite-plugin-ssam-ffmpeg";
import { ssamGit } from "vite-plugin-ssam-git";
import { ssamReplicate } from "vite-plugin-ssam-replicate";
// import { ssamTimelapse } from "vite-plugin-ssam-timelapse";

// create .env.DEV.local file
// add REPLICATE_API_KEY=yourkeyvalue
// do not share your key with anyone!
const envVars = loadEnv("DEV", process.cwd(), "REPLICATE_");

export default defineConfig({
  base: "./",
  plugins: [
    ssamExport(),
    ssamGit(),
    ssamFfmpeg(),
    ssamReplicate({
      apiKey: envVars.REPLICATE_API_KEY,
      testOutput: ["./output/test.png"],
    }),
    // ssamTimelapse(),
  ],
  clearScreen: false,
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
});
