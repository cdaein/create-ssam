import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { gitSnapshot } from "./vite-plugin-ssam-git";

export default defineConfig({
  plugins: [glsl(), gitSnapshot()],
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
});
