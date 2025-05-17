import React from "react";

interface ToolbarProps {
  language: string;
  setLanguage: (lang: string) => void;
  onRun: () => void;
  terminalVisible: boolean;
  toggleTerminal: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  language,
  setLanguage,
  onRun,
  terminalVisible,
  toggleTerminal,
}) => {
  return (
    <div className="flex items-center px-4 py-2 bg-gray-900 shadow-md select-none">
      {/* Language selector - left */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 text-white rounded px-2 py-1"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="java">Java</option>
      </select>

      {/* Spacer to push Run button to center */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={onRun}
          className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 transition text-white font-semibold"
          title="Run Code"
        >
          Run
        </button>
      </div>

      {/* Terminal toggle - right */}
      <button
        onClick={toggleTerminal}
        className="ml-2 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition text-white font-semibold"
        title="Toggle Terminal"
      >
        {terminalVisible ? "Hide Terminal" : "Show Terminal"}
      </button>
    </div>
  );
};

export default Toolbar;
