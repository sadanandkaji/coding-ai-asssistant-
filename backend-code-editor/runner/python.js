const { exec } = require("child_process");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const path = require("path");

async function runPython(code) {
  const filename = `${uuid()}.py`;
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, code);

  return new Promise((resolve, reject) => {
    exec(`python3 ${filepath}`, (err, stdout, stderr) => {
      fs.unlinkSync(filepath);
      if (err) return reject({ stderr });
      resolve({ stdout });
    });
  });
}

module.exports = { runPython };
