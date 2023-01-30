import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  build: {
    outDir: "./dist",
    assetsDir: ".",
    rollupOptions: {
      //
    },
  },
  plugins: [glsl()],
});
