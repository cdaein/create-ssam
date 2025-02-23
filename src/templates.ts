import kleur from "kleur";
import type { ExtraPack, Template } from "./types";

const { red, green, yellow, blue, magenta, white, bold } = kleur;

// lock versions for all deps/devDeps - it's much faster to install (use cache)
// update packs values from time to time
const packs = {
  // ssam
  ssam: "ssam@0.20.1",
  "ssam-export": "vite-plugin-ssam-export@0.1.1",
  "ssam-ffmpeg": "vite-plugin-ssam-ffmpeg@0.2.3",
  "ssam-git": "vite-plugin-ssam-git@0.1.2",
  "ssam-replicate": "vite-plugin-ssam-replicate@0.1.4",
  "ssam-timelapse": "vite-plugin-ssam-timelapse@0.1.2",
  // devDeps
  typescript: "typescript@5.7.3",
  vite: "vite@6.1.1",
  prettier: "prettier@3.5.1",
  // templates
  ogl: "ogl@1.0.11",
  glsl: "vite-plugin-glsl@1.3.1",
  three: "three@0.173.0",
  "types-three": "@types/three@0.173.0",
  // extras
  "thing-color": "@thi.ng/color@5.7.24",
  "thing-color-palettes": "@thi.ng/color-palettes@1.4.33",
  // daeinc packs
  "daeinc-draw": "@daeinc/draw@0.6.1",
  "daeinc-geom": "@daeinc/geom@0.12.0",
  "daeinc-keyframes": "@daeinc/keyframes@0.1.0",
  "daeinc-math": "@daeinc/math@0.8.0",
  "daeinc-pd-timeline": "@daeinc/pd-timeline@0.1.1",
  "daeinc-timeline": "@daeinc/timeline@0.5.2",
  // random
  "thing-arrays": "@thi.ng/arrays@2.10.15",
  "thing-random": "@thi.ng/random@4.1.11",
  // animation
  eases: "eases@1.0.8",
  "types-eases": "@types/eases@1.0.4",
};

// const commonPkgs = `ssam`;
// NOTE: to prevent dependency error outside the control, don't use @latest, and lock the versions.
//       test updated deps from time to time before updating create-ssam.
//       users can always update package.json themselves.
const commonTSPkgs = `${packs["typescript"]} ${packs["vite"]} ${packs["prettier"]}`;
const commonJSPkgs = `${packs["vite"]} ${packs["prettier"]}`;
const ssamPluginPkgs = `${packs["ssam-export"]} ${packs["ssam-ffmpeg"]} ${packs["ssam-git"]} ${packs["ssam-timelapse"]}`;
const viteGlslPkg = `${packs["glsl"]}`;

// option name follows the format "/templates/template-" + name
export const templates: Template[] = [
  {
    name: "vanilla",
    display: "Vanilla",
    description: "Set up without Canvas libraries. (or install yourself)",
    color: yellow,
    options: [
      {
        name: "vanilla-ts",
        display: "TypeScript",
        description: "Create a vanilla sketch in TypeScript",
        color: blue,
        installCommands: {
          dep: `${packs["ssam"]} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "vanilla",
        display: "JavaScript",
        description: "Create a vanilla sketch in JavaScript.",
        color: yellow,
        installCommands: {
          dep: `${packs["ssam"]} --prefix TARGET_DIR`,
          devDep: `${commonJSPkgs} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
    ],
  },

  {
    name: "ogl",
    display: "OGL",
    description: "Set up with OGL WebGL library",
    color: green,
    options: [
      {
        name: "ogl-shader-ts",
        display: "Fullscreen Shader TS",
        description: "A shader sketch in TypeScript with Lygia",
        color: blue,
        installCommands: {
          git: `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          dep: `${packs["ssam"]} ${packs["ogl"]} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "ogl-cube-ts",
        display: "Basic Cube Scene TS",
        description: "A basic 3d cube scene in TypeScript",
        color: green,
        installCommands: {
          dep: `${packs["ssam"]} ${packs["ogl"]} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
    ],
  },

  {
    name: "three",
    display: "Three.js",
    description: "Set up with Three.js WebGL library",
    color: magenta,
    options: [
      {
        name: "three-cube-ts",
        display: "Basic Cube TS",
        description: "A basic 3d cube scene in TypeScript with Lygia",
        color: green,
        installCommands: {
          git: `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          dep: `${packs["ssam"]} ${packs["three"]} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${packs["types-three"]} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "three-shader-ts",
        display: "Fullscreen Shader TS",
        description: "A shader sketch in TypeScript with Lygia",
        color: blue,
        installCommands: {
          git: `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          dep: `${packs["ssam"]} ${packs["three"]} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${packs["types-three"]} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "three-webgpu-ts",
        display: "WebGPU TS",
        description: "A basic WebGPU scene with TSL",
        color: green,
        installCommands: {
          dep: `${packs["ssam"]} ${packs["three"]} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${packs["types-three"]} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "three-shader-js",
        display: "Fullscreen Shader JS",
        description: "A shader sketch in JavaScript with Lygia",
        color: yellow,
        installCommands: {
          git: `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          dep: `${packs["ssam"]} ${packs["three"]} --prefix TARGET_DIR`,
          devDep: `${commonJSPkgs} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
    ],
  },
  {
    name: "experimental",
    display: "Experimental",
    description: "Templates that don't belong in other categories",
    color: white,
    options: [
      {
        name: "sd-replicate-ts",
        display: "StableDiffusion via Replicate API",
        description: "Use Replicate API to generate images (API key required)",
        color: blue,
        installCommands: {
          dep: `${packs["ssam"]} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${ssamPluginPkgs} ${packs["ssam-replicate"]} @types/node replicate@0.25.2 --prefix TARGET_DIR`,
        },
      },
    ],
  },
];

// NOTE: prompts doesn't return "title" in response. it returns "value"
export const extraPacks: ExtraPack[] = [
  {
    title: `Color`,
    description: "Install @thi.ng/color and @thi.ng/color-palettes",
    value: {
      dep: `${packs["thing-color"]} ${packs["thing-color-palettes"]}`,
    },
  },
  {
    title: `Daeinc Pack`,
    description: "Install @daeinc/math, @daeinc/geom and @daeinc/draw",
    value: {
      dep: `${packs["daeinc-math"]} ${packs["daeinc-geom"]} ${packs["daeinc-draw"]}`,
    },
  },
  {
    title: `Random`,
    description: "Install @thi.ng/random and @thi.ng/arrays",
    value: { dep: `${packs["thing-random"]} ${packs["thing-arrays"]}` },
  },
  {
    title: `Animation`,
    description:
      "Install @daeinc/pd-timeline, @daeinc/timeline, @daeinc/keyframes and eases",
    value: {
      dep: `${packs["eases"]} ${packs["daeinc-pd-timeline"]} ${packs["daeinc-timeline"]} ${packs["daeinc-keyframes"]}`,
      devDep: `${packs["types-eases"]}`,
    },
  },
];
