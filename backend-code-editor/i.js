const { exec } = require("child_process");

const code = 'console.log("hi")';

exec(`node -e ${JSON.stringify(code)}`, (err, stdout, stderr) => {
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);
  console.log("err:", err);
});
