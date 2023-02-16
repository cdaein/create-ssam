import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { ssamGit } from "vite-plugin-ssam-git";
import { ssamTimelapse } from "vite-plugin-ssam-timelapse";

export default defineConfig({
  plugins: [
    glsl({
      warnDuplicatedImports: false,
    }),
    ssamGit(),
    ssamTimelapse(),
  ],
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
});
