import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { gitSnapshot } from "./vite-plugin-ssam-git";

export default defineConfig({
  plugins: [
    glsl({
      warnDuplicatedImports: false,
    }),
    gitSnapshot(),
  ],
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
});
