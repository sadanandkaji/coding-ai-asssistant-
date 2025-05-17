const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { runPython } = require("./runner/python");
const { runJS } = require("./runner/js");
const { runC } = require("./runner/c");
const { runCPP } = require("./runner/cpp");
const { runJava } = require("./runner/java");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", async (req, res) => {
  const { code, language, input } = req.body;

  try {
    let output;
    switch (language) {
      case "python":
        output = await runPython(code, input);
        break;
      case "javascript":
        output = await runJS(code, input);
        break;
      case "c":
        output = await runC(code, input);
        break;
      case "cpp":
        output = await runCPP(code, input);
        break;
      case "java":
        output = await runJava(code, input);
        break;
      default:
        return res.status(400).json({ error: "Unsupported language" });
    }
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(8000, () => {
  console.log("Code Runner server running on http://localhost:8000");
});
