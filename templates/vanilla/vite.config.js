import { defineConfig } from "vite";
import { ssamExport } from "vite-plugin-ssam-export";
import { ssamFfmpeg } from "vite-plugin-ssam-ffmpeg";
import { ssamGit } from "vite-plugin-ssam-git";
// import { ssamTimelapse } from "vite-plugin-ssam-timelapse";

export default defineConfig({
  base: "./",
  plugins: [
    ssamExport(),
    ssamGit(),
    ssamFfmpeg(),
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
