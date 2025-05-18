const WebSocket = require("ws");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const wss = new WebSocket.Server({ port: 8000 });

function prefixOutput(output) {
  return output
    .split(/\r?\n/)
    .map((line) => (line.trim() ? `-> ${line}` : line))
    .join("\n");
}

function runCode(code, callback) {
  const tmpFile = path.join(os.tmpdir(), `temp_${Date.now()}.js`);
  fs.writeFile(tmpFile, code, (writeErr) => {
    if (writeErr) {
      callback(writeErr, null, null);
      return;
    }

    exec(`node "${tmpFile}"`, (execErr, stdout, stderr) => {
      fs.unlink(tmpFile, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete temp file:", unlinkErr);
        }
      });

      callback(execErr, stdout, stderr);
    });
  });
}

wss.on("connection", (ws) => {
  console.log("⚡ Client connected");
  ws.send("✅ Connected to server\n");

  ws.on("message", (msg) => {
    try {
      const { code, language } = JSON.parse(msg);
      console.log("Received:", JSON.stringify({ code, language }));

      if (language === "javascript") {
        runCode(code, (err, stdout, stderr) => {
          if (err) {
            // Prefix stderr lines
            const out = prefixOutput(stderr || `❌ Execution error: ${err.message}\n`);
            ws.send(out);
          } else {
            const out = prefixOutput(stdout || "✅ No output\n");
            ws.send(out);
          }
        });
      } else {
        ws.send("❌ Language not supported yet.\n");
      }
    } catch (err) {
      ws.send("⚠️ Error parsing code\n");
    }
  });
});

console.log("WebSocket server running on ws://localhost:8000");
