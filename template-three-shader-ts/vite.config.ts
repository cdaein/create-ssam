import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { ssamGit } from "vite-plugin-ssam-git";

export default defineConfig({
  plugins: [glsl(), ssamGit()],
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
});
