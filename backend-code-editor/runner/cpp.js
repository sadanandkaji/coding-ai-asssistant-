const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

async function runCPP(code, input = "") {
  const folder = path.join(__dirname, "..", "temp2", uuid()); // changed from temp to temp2
  fs.mkdirSync(folder, { recursive: true });

  const filePath = path.join(folder, "main.cpp");
  const executablePath = path.join(folder, "main.out");

  fs.writeFileSync(filePath, code);

  // Compile C++ code
  await new Promise((resolve, reject) => {
    exec(`g++ ${filePath} -o ${executablePath}`, (err, stdout, stderr) => {
      if (err) reject(stderr);
      else resolve(stdout);
    });
  });

  // Run compiled program
  return new Promise((resolve, reject) => {
    const runProcess = spawn(executablePath);

    let output = "";
    let error = "";

    runProcess.stdout.on("data", (data) => (output += data.toString()));
    runProcess.stderr.on("data", (data) => (error += data.toString()));

    runProcess.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(error || "Execution failed");
    });

    if (input) {
      runProcess.stdin.write(input);
    }
    runProcess.stdin.end();
  });
}

module.exports = { runCPP };
