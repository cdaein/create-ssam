/**
 *
 * - add CLI flag options (instead of going through prompts)
 * - instead of using custom command, search for all dependency used in src/* and install them
 *
 * -> more options
 *   - choose multiple common ones
 *     - @thi.ng/random
 *     - @thi.ng/vector
 *     - mouse/keyboard events
 *     - image loader
 *
 * TODO:
 * - copy the same single _gitignore from root
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
  color: kleur.Color;
  options: TemplateOption[];
};

type TemplateOption = {
  name: string;
  display: string;
  color: kleur.Color;
  customCommands?: string[];
};

const commonPkgs = `ssam`;
const ssamPluginPkgs = `vite-plugin-ssam-export vite-plugin-ssam-ffmpeg vite-plugin-ssam-git vite-plugin-ssam-timelapse`;
const oglPkg = `ogl@0.0.110`;
const viteGlslPkg = `vite-plugin-glsl@1.1.2`;
const threePkg = `three`;

// option name follows the format "template-" + name
const templates: Template[] = [
  {
    name: "vanilla",
    display: "Vanilla",
    color: yellow,
    options: [
      {
        name: "vanilla-ts",
        display: "TypeScript",
        color: blue,
        customCommands: [
          `npm install ssam@latest --prefix TARGET_DIR`,
          `npm install -D ${ssamPluginPkgs} --prefix TARGET_DIR`,
        ],
      },
      {
        name: "vanilla",
        display: "JavaScript",
        color: yellow,
        customCommands: [
          `npm install ssam@latest --prefix TARGET_DIR`,
          `npm install -D ${ssamPluginPkgs} --prefix TARGET_DIR`,
        ],
      },
    ],
  },
  {
    name: "ogl",
    display: "OGL",
    color: green,
    options: [
      // {
      //   name: "ogl-shader-ts",
      //   display: "Fullscreen Shader TS",
      //   color: blue,
      //   customCommands: [
      //     `npm install ssam@latest ${oglPkg} --prefix TARGET_DIR`,
      //     `npm install -D @types/ogl@npm:ogl-types ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
      //   ],
      // },
      {
        name: "ogl-shader-lygia-ts",
        display: "Fullscreen Shader TS with Lygia",
        color: blue,
        customCommands: [
          `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          `npm install ssam@latest ${oglPkg} --prefix TARGET_DIR`,
          `npm install -D @types/ogl@npm:ogl-types ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        ],
      },
      {
        name: "ogl-cube-ts",
        display: "Basic Cube Scene TS",
        color: green,
        customCommands: [
          `npm install ssam@latest ${oglPkg} --prefix TARGET_DIR`,
          `npm install -D @types/ogl@npm:ogl-types ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        ],
      },
    ],
  },
  {
    name: "three",
    display: "Three.js",
    color: magenta,
    options: [
      // {
      //   name: "three-shader-ts",
      //   display: "Fullscreen Shader TS",
      //   color: blue,
      //   customCommands: [
      //     `npm install ssam@latest ${threePkg} --prefix TARGET_DIR`,
      //     `npm install -D @types/three ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
      //   ],
      // },
      {
        name: "three-shader-lygia-ts",
        display: "Fullscreen Shader TS with Lygia",
        color: blue,
        customCommands: [
          `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          `npm install ssam@latest ${threePkg} --prefix TARGET_DIR`,
          `npm install -D @types/three ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        ],
      },
      // {
      //   name: "three-shader-js",
      //   display: "Fullscreen Shader JS",
      //   color: yellow,
      //   customCommands: [
      //     `npm install ssam@latest ${threePkg} --prefix TARGET_DIR`,
      //     `npm install -D ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
      //   ],
      // },
      {
        name: "three-shader-lygia-js",
        display: "Fullscreen Shader JS with Lygia",
        color: yellow,
        customCommands: [
          `git clone --no-tags --depth 1 --single-branch --branch=main https://github.com/patriciogonzalezvivo/lygia.git`,
          `npm install ssam@latest ${threePkg} --prefix TARGET_DIR`,
          `npm install -D ${viteGlslPkg} ${ssamPluginPkgs} --prefix TARGET_DIR`,
        ],
      },
    ],
  },
];

// const languages = [
//   {
//     name: "ts",
//     display: "Typescript",
//     color: blue,
//   },
//   {
//     name: "js",
//     display: "JavaScript",
//     color: yellow,
//   },
// ];

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
    })
  )}`
);

log(bold().white(`Let's create a new sketch with ssam/쌈.\n`));

async function init() {
  let response: prompts.Answers<
    "projectName" | "overwrite" | "packageName" | "template" | "option"
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
                  ` is not empty. Try again with another name or empty the directory first.`
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
                value: option.name,
              };
            }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " cancelled");
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  const { overwrite, packageName, option } = response;

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
    `template-${option}`
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
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
  );

  pkg.name = packageName || getProjectName();

  write("package.json", JSON.stringify(pkg, null, 2));

  const { customCommands } =
    templates.flatMap((t) => t.options).find((o) => o.name === option) ?? {};

  // REVIEW: yarn install test?
  if (customCommands) {
    customCommands.forEach((customCommand) => {
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
    console.log(`  cd ${path.relative(cwd, root)}`);
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
    `\nFind the latest updates of Ssam at http://github.com/cdaein/ssam`
  );
  console.log();
}

init();

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
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
