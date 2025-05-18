import React, { useEffect , useRef } from "react";
import Sidebar from "./components/sidebar";
import Toolbar from "./components/toolbar";
import TabBar from "./components/tabbar";
import CodeEditorWindow from "./components/codeeditor";
import CodeTerminal from "./components/xtream";
import useResizablePanels from "./hooks/handler";
import "./App.css";

const App: React.FC = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const {
    files,
    activeFileIndex,
    language,
    sidebarWidth,
    terminalHeight,
    terminalVisible,
    setFiles,
    setActiveFileIndex,
    setLanguage,
    hiddenTabs,
    setHiddenTabs,
    handleRun,
    updateCode,
    toggleTerminal,
    sidebarResizeMouseDown,
    terminalResizeMouseDown,
  } = useResizablePanels(socketRef);

  const handleAddFile = (filename: string) => {
    filename = filename.trim();
    if (!filename || !filename.includes(".")) {
      return;
    }

    if (files.some((f) => f.name === filename)) {
      return;
    }

    let ext = filename.split(".").pop()?.toLowerCase() || "js";

    let newLang = "javascript";
    if (ext === "py") newLang = "python";
    else if (ext === "cpp" || ext === "cxx") newLang = "cpp";
    else if (ext === "c") newLang = "c";
    else if (ext === "java") newLang = "java";

    const newFile = {
      name: filename,
      code: "",
    };

    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
    setLanguage(newLang);
  };

  useEffect(() => {
    const filename = files[activeFileIndex]?.name || "";
    if (filename.endsWith(".py")) setLanguage("python");
    else if (filename.endsWith(".cpp")) setLanguage("cpp");
    else if (filename.endsWith(".c")) setLanguage("c");
    else if (filename.endsWith(".java")) setLanguage("java");
    else if (filename.endsWith(".js")) setLanguage("javascript");
    else setLanguage("javascript");
  }, [activeFileIndex, files, setLanguage]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 select-none">
      <Toolbar
        language={language}
        setLanguage={setLanguage}
        onRun={handleRun}
        terminalVisible={terminalVisible}
        toggleTerminal={toggleTerminal}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with shadow and border */}
        <Sidebar
          files={files}
          setFiles={setFiles}
          setActiveFileIndex={setActiveFileIndex}
          setLanguage={setLanguage}
          activeFileIndex={activeFileIndex}
          hiddenTabs={hiddenTabs}
          setHiddenTabs={setHiddenTabs}
          width={sidebarWidth}
          onResizeMouseDown={sidebarResizeMouseDown}
          onAddFile={handleAddFile}
          onDeleteFile={(index) => {
            if (files.length === 1) return;
            const updatedFiles = files.filter((_, i) => i !== index);
            setFiles(updatedFiles);
            if (activeFileIndex >= updatedFiles.length) {
              setActiveFileIndex(updatedFiles.length - 1);
            } else if (index === activeFileIndex) {
              setActiveFileIndex(Math.max(0, activeFileIndex - 1));
            }
          }}
        />

        <div className="flex flex-col flex-1 overflow-hidden bg-gray-800">
          {/* TabBar with border bottom */}
          <TabBar
            files={files}
            activeFileIndex={activeFileIndex}
            setActiveFileIndex={setActiveFileIndex}
            hiddenTabs={hiddenTabs}
            setHiddenTabs={setHiddenTabs}
          />

          {/* Code Editor Area with subtle shadow */}
          <div className="flex-1 overflow-auto shadow-inner">
            {activeFileIndex >= 0 && files[activeFileIndex] && (
              <CodeEditorWindow
                code={files[activeFileIndex].code}
                onChange={updateCode}
                language={language}
                theme="vs-dark"
              />
            )}
          </div>

          {/* Terminal Panel */}
          {terminalVisible && (
  <>
    <div
      onMouseDown={terminalResizeMouseDown}
      className="h-2 bg-gray-600 cursor-row-resize transition-colors hover:bg-gray-500"
      title="Drag to resize terminal"
    />
   <div
  style={{ height: terminalHeight }}
  className="bg-black text-green-400 font-mono overflow-auto border-t border-gray-700 shadow-inner"
>
  <CodeTerminal socketRef={socketRef} />
</div>

  </>
)}

        </div>
      </div>
    </div>
  );
};

export default App;
