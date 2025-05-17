const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

async function runJava(code, input = '') {
  const folder = path.join(__dirname, '..', 'temp', uuid());
  fs.mkdirSync(folder, { recursive: true });

  const filePath = path.join(folder, 'Main.java');
  fs.writeFileSync(filePath, code);

  // Compile
  await new Promise((resolve, reject) => {
    exec(`javac ${filePath}`, (err, stdout, stderr) => {
      if (err) reject(stderr);
      else resolve(stdout);
    });
  });

  // Run
  return new Promise((resolve, reject) => {
    const javaProcess = spawn('java', ['-cp', folder, 'Main']);
    let output = '';
    let error = '';

    javaProcess.stdout.on('data', (data) => (output += data.toString()));
    javaProcess.stderr.on('data', (data) => (error += data.toString()));

    javaProcess.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(error);
    });

    javaProcess.stdin.write(input);
    javaProcess.stdin.end();
  });
}

module.exports = { runJava };
