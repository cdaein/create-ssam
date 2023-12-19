/**
 *
 * - add CLI flag options (instead of going through prompts)
 * - instead of using custom command, search for all dependency used in src/* and install them
 *
 * FIX: yarn doesn't have -D or --save-dev => yarn add --dev
 * -> more options
 *   - choose multiple common ones
 *     - @thi.ng/vector
 *     - mouse/keyboard events
 *     - image loader
 *
 * TODO:
 * - `yarn add` test (also, dev packages)
 * - copy the common files (ex. _gitignore) from commons folder
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import spawn from "cross-spawn";
import prompts from "prompts";
import kleur from "kleur";
import figlet from "figlet";

const log = console.log;

// const { red, green, yellow, blue, magenta, cyan, white } = kleur;
const { red, green, yellow, blue, magenta, white, bold, bgGreen } = kleur;

const cwd = process.cwd();

type Template = {
  name: string;
  display: string;
  description: string;
  color: kleur.Color;
  options: TemplateOption[];
};

type InstallCommandsGroup = {
  dep?: string;
  devDep?: string;
  git?: string;
};

type TemplateOption = {
  name: string;
  display: string;
  description: string;
  color: kleur.Color;
  installCommands?: InstallCommandsGroup;
};

type ExtraPack = {
  title: string;
  description: string;
  value: InstallCommandsGroup;
};

const commonPkgs = `ssam`;
// NOTE: to prevent dependency error outside the control, don't use @latest, and lock the versions.
//       test updated deps from time to time before updating create-ssam.
//       users can always update package.json themselves.
const commonTSPkgs = `typescript@5.3.3 vite@5.0.10`;
const commonJSPkgs = `vite@5.0.10`;
const ssamPluginPkgs = `vite-plugin-ssam-export vite-plugin-ssam-ffmpeg vite-plugin-ssam-git vite-plugin-ssam-timelapse`;
const oglPkg = `ogl@1.0.3`;
const viteGlslPkg = `vite-plugin-glsl@1.2.1`;
const threePkg = `three@0.159.0`;

// NOTE: prompts doesn't return "title" in response. it returns "value"
const extraPacks: ExtraPack[] = [
  {
    title: `Color`,
    description: "Install @thi.ng/color and @thi.ng/color-palettes",
    value: {
      dep: `@thi.ng/color @thi.ng/color-palettes`,
    },
  },
  {
    title: `Daeinc Pack`,
    description: "Install @daeinc/math, @daeinc/geom and @daeinc/draw",
    value: { dep: `@daeinc/math @daeinc/geom @daeinc/draw` },
  },
  // NOTE: Lygia extra install is disabled because
  // Lygia is installed via supported templates AND here (twice).
  // maybe, check if template uses lygia, and decide to include or not?
  // {
  //   title: `Lygia (GLSL)`,
  //   description: "Git clone Lygia shader library",
  //   value: {
  //     git: `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
  //   },
  // },
  {
    title: `Random`,
    description: "Install @thi.ng/random and @thi.ng/arrays",
    value: { dep: `@thi.ng/random @thi.ng/arrays` },
  },
  {
    title: `Animation`,
    description: "Install @daeinc/timeline, @daeinc/keyframes and eases",
    value: {
      dep: `eases @daeinc/timeline @daeinc/keyframes`,
      devDep: `@types/eases`,
    },
  },
];

// option name follows the format "/templates/template-" + name
const templates: Template[] = [
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
          dep: `ssam@latest --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "vanilla",
        display: "JavaScript",
        description: "Create a vanilla sketch in JavaScript.",
        color: yellow,
        installCommands: {
          dep: `ssam@latest --prefix TARGET_DIR`,
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
          dep: `ssam@latest ${oglPkg} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "ogl-cube-ts",
        display: "Basic Cube Scene TS",
        description: "A basic 3d cube scene in TypeScript",
        color: green,
        installCommands: {
          dep: `ssam@latest ${oglPkg} --prefix TARGET_DIR`,
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
          dep: `ssam@latest ${threePkg} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} @types/three ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "three-shader-ts",
        display: "Fullscreen Shader TS",
        description: "A shader sketch in TypeScript with Lygia",
        color: blue,
        installCommands: {
          git: `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          dep: `ssam@latest ${threePkg} --prefix TARGET_DIR`,
          devDep: `${commonTSPkgs} @types/three ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
      {
        name: "three-shader-js",
        display: "Fullscreen Shader JS",
        description: "A shader sketch in JavaScript with Lygia",
        color: yellow,
        installCommands: {
          git: `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          dep: `ssam@latest ${threePkg} --prefix TARGET_DIR`,
          devDep: `${commonJSPkgs} ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        },
      },
    ],
  },
];

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
};

const defaultTargetDir = "sketch-ssam";
let targetDir = defaultTargetDir;

log(
  `${green(
    figlet.textSync("create ssam", {
      font: "Ogre",
      whitespaceBreak: true,
    }),
  )}`,
);

log(bold().white(`Let's create a new sketch with ssam/쌈.\n`));

async function init() {
  let response: prompts.Answers<
    | "projectName"
    | "overwrite"
    | "packageName"
    | "template"
    | "option"
    | "extra"
  >;

  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir;

  try {
    response = await prompts(
      [
        // project name
        {
          type: "text",
          name: "projectName",
          message: "Name your project:",
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },

        // handle directory
        {
          type: () => {
            if (!fs.existsSync(targetDir) || isEmpty(targetDir)) {
              return null;
            } else {
              throw new Error(
                red("✖") +
                  ` Target directory "${targetDir}"` +
                  ` is not empty. Try again with another name or empty the directory first.`,
              );
            }
          },
          name: "overwrite",
        },

        //
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled");
            }
            return null;
          },
          name: "overwriteChecker",
        },

        // package name
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: "Package name:",
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },

        // template
        {
          type: "select",
          name: "template",
          message: "Choose your template",
          initial: 0,
          choices: templates.map((template) => {
            return {
              title: template.color(template.display),
              description: template.description,
              value: template,
            };
          }),
        },

        // template option
        {
          type: "select",
          name: "option",
          message: "Choose a template option",
          initial: 0,
          choices: (template: Template) =>
            template.options.map((option) => {
              return {
                title: option.color(option.display),
                description: option.description,
                value: option.name,
              };
            }),
        },

        // extra dependencies
        {
          type: "multiselect",
          name: "extra",
          message: "Optionally, select extra packages to install",
          choices: extraPacks,
          instructions: false,
          hint: "- Space to select. Return to submit",
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " cancelled");
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  const { overwrite, packageName, option, extra } = response;

  const root = path.join(cwd, targetDir);

  if (!overwrite && !fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : "npm";
  const isYarn1 = pkgManager === "yarn" && pkgInfo?.version.startsWith("1.");

  log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `templates`,
    `${option}`,
  );

  // REVIEW: i don't overwrite
  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  // TODO: do not copy node_modules/*, package-lock.json,
  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== "package.json")) {
    write(file);
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8"),
  );

  pkg.name = packageName || getProjectName();

  write("package.json", JSON.stringify(pkg, null, 2));

  // 1. get install commands from template option
  // 2. get install commnads from extra
  // 3. combine them into a single array
  // 4. run install commands for each (3 times)

  const { installCommands } =
    templates.flatMap((t) => t.options).find((o) => o.name === option) ?? {};

  // collect all install commands from template option & extra packages
  const toInstall = ["npm install"];
  const toInstallDev = ["npm install -D"];
  const toGit = [];

  if (installCommands) {
    installCommands.dep && toInstall.push(installCommands.dep);
    installCommands.devDep && toInstallDev.push(installCommands.devDep);
    installCommands.git && toGit.push(installCommands.git);
  }

  for (let i = 0; i < extra.length; i++) {
    extra[i].dep && toInstall.push(extra[i].dep);
    extra[i].devDep && toInstallDev.push(extra[i].devDep);
    extra[i].git && toGit.push(extra[i].git);
  }

  const toInstallStr = toInstall.join(" ");
  const toInstallDevStr = toInstallDev.join(" ");
  const toGitStr = toGit.join(" ");

  const combinedInstallCommands = [
    toInstallStr,
    toInstallDevStr,
    toGitStr,
  ].filter((str) => str.length !== 0);

  // console.log(installCommands);
  // log({ toInstallStr });
  // log({ toInstallDevStr });
  // log({ toGitStr });
  // REVIEW: log or not?
  // log(combinedInstallCommands);

  if (combinedInstallCommands) {
    combinedInstallCommands.forEach((customCommand) => {
      const fullCustomCommand = customCommand
        .replace("TARGET_DIR", targetDir)
        .replace(/^npm create/, `${pkgManager} create`)
        .replace(/^npm install/, `${pkgManager} install`)
        // Only Yarn 1.x doesn't support `@version` in the `create` command
        .replace("@latest", () => (isYarn1 ? "" : "@latest"))
        .replace(/^npm exec/, () => {
          // Prefer `pnpm dlx` or `yarn dlx`
          if (pkgManager === "pnpm") {
            return "pnpm dlx";
          }
          if (pkgManager === "yarn" && !isYarn1) {
            return "yarn dlx";
          }
          // Use `npm exec` in all other cases,
          // including Yarn 1.x and other custom npm clients.
          return "npm exec";
        });

      const [command, ...args] = fullCustomCommand.split(" ");

      const { status } = spawn.sync(command, args, {
        stdio: "inherit",
        cwd: command.startsWith(`git`) ? targetDir : `.`,
      });
      // process.exit(status ?? 0);
    });
  }

  console.log(`\nDone. Now run:\n`);

  if (root !== cwd) {
    console.log(`  ${bold(`cd`)} ${path.relative(cwd, root)}`);
  }
  switch (pkgManager) {
    case "yarn":
      console.log("  yarn");
      console.log("  yarn dev");
      break;
    default:
      // console.log(`  ${pkgManager} install`);
      console.log(`  ${pkgManager} run dev`);
      break;
  }
  console.log(
    `\nFind the latest updates of Ssam at http://github.com/cdaein/ssam`,
  );
  console.log();
}

init();

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  );
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}
