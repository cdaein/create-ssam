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
 * TODO: `yarn add` test (also, dev packages)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import spawn from "cross-spawn";
import prompts from "prompts";
import kleur from "kleur";
import figlet from "figlet";
import packageJson from "../package.json";
import { extraPacks, templates } from "./templates";
import { Template } from "./types";

const log = console.log;

const { red, green, bold } = kleur;

const cwd = process.cwd();

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
  _prettierrc: ".prettierrc",
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

log(green(`v${packageJson.version}`));

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
            // replace any space with dash ("-") in the project name. otherwise, `npm --prefix` will get confused.
            targetDir =
              formatTargetDir(toValidPackageName(state.value)) ||
              defaultTargetDir;
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
  const write = (fromDir: string, file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(fromDir, file), targetPath);
    }
  };

  // copy files from template folder
  const templateFiles = fs.readdirSync(templateDir);
  for (const file of templateFiles.filter((f) => f !== "package.json")) {
    write(templateDir, file);
  }

  // copy common files that are same for all templates (ex. .gitignore)
  // skip with warning if file already exists (but prompts already check for empty folder so it's fine for now)
  const commonFilesDir = path.resolve(
    fileURLToPath(import.meta.url), // `import.meta.url` returns `<project>/dist/index.js`
    "../..",
    `templates/_commons`,
  );
  const commonFiles = fs.readdirSync(commonFilesDir);
  for (const file of commonFiles) {
    if (file === `README.md`) {
      // add project title to README.md
      const title = getProjectName();
      write(commonFilesDir, file, `# ${title}\n`);
    } else {
      write(commonFilesDir, file);
    }
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8"),
  );

  pkg.name = packageName || getProjectName();

  write(templateDir, "package.json", JSON.stringify(pkg, null, 2));

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

  // REVIEW: log or not?
  // log(combinedInstallCommands);
  // TODO: log installed packages + version (format nicely)

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

      console.log("");
      console.log(green(fullCustomCommand));

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
