import { exec } from "child_process";
import kleur from "kleur";

const { gray, green, yellow } = kleur;

const execPromise = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

export const gitSnapshot = () => ({
  name: "git-snapshot",
  configureServer(server) {
    server.ws.on("ssam:git", (data, client) => {
      const prefix = `${gray(new Date().toLocaleTimeString())} ${green(
        `[ssam]`
      )}`;

      const { canvasId, filename, format } = data;

      execPromise(`git status --porcelain`)
        .then((value) => {
          return execPromise(`git add . && git commit -am ${filename}`);
        })
        .then((value) => {
          {
            const msg = `${prefix} ${value}`;
            client.send("ssam:log", { msg });
            console.log(`${prefix} ${value}`);
          }

          return execPromise(`git rev-parse --short HEAD`);
        })
        .then((hash) => {
          {
            client.send("ssam:git-success", {
              canvasId,
              hash: hash.trim(),
            });
          }
        })
        .catch((err) => {
          if (!err) {
            const msg = `${prefix} nothing to commit, working tree clean`;
            client.send("ssam:warn", { msg });
            console.warn(`${msg}`);
          } else {
            const msg = `${prefix} ${err}`;
            client.send("ssam:warn", { msg });
            console.error(`${prefix} ${yellow(`${err}`)}`);
          }
        });
    });
  },
});
