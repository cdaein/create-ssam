import { defineConfig } from "vite";
import { ssamGit } from "vite-plugin-ssam-git";
import { ssamTimelapse } from "vite-plugin-ssam-timelapse";

export default defineConfig({
  plugins: [ssamGit(), ssamTimelapse()],
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
});
