const { exec } = require("child_process");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const path = require("path");

async function runJS(code) {
  const filename = `${uuid()}.js`;
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, code);

  return new Promise((resolve, reject) => {
    exec(`node ${filepath}`, (err, stdout, stderr) => {
      fs.unlinkSync(filepath);
      if (err) return reject({ stderr });
      resolve({ stdout });
    });
  });
}

module.exports = { runJS };
