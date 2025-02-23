# create-ssam

Ssam (쌈 as in Korean dish) wraps your HTML5 Canvas sketches and provides helpful features such as animation props, image and video exports on top of Node.js and Vite bundler. The design is minimal so you can bring your own canvas library (or use as vanilla js).

Learn how to quickstart a creative coding sketch with [`ssam`](https://github.com/cdaein/ssam) on its [wiki](https://github.com/cdaein/ssam/wiki). This package `create-ssam` sets up a basic sketch structure using one of the templates.

## How to

```sh
 npm create ssam@latest
```

Then, follow the prompts.

It will set up all the necessary files and Vite bundler so you can go straight into creative coding.

## Templates

- Vanilla
  - TypeScript
  - JavaScript
- OGL
  - Fullscreen Shader TS with Lygia
  - Basic Cube TS
- Three
  - Basic Cube TS
  - Fullscreen Shader TS with Lygia
  - WebGPU TS
  - Fullscreen Shader JS with Lygia
- StableDiffusion
  - Replicate API TS

## Test Locally

- `npm run build`
- `npm link` to make it available locally
- on Desktop, `node ~/path/to/bin/create-ssam.js`
- follow setup instructions.

## Build Tips

- `npm version <patch/minor/major` and then, `npm run build` so the correct packageJson version will be included in the dist.

## License

MIT

The base code is adapted from [`create-vite`](https://github.com/vitejs/vite/tree/main/packages/create-vite)
