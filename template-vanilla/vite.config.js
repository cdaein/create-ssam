import { defineConfig } from "vite";
import { ssamGit } from "vite-plugin-ssam-git";
import { ssamTimelapse } from "vite-plugin-ssam-timelapse";
import { ssamFfmpeg } from "vite-plugin-ssam-ffmpeg";

export default defineConfig({
  plugins: [ssamGit(), ssamTimelapse(), ssamFfmpeg()],
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
});
