import { useState } from "react";

const useResizablePanels = (socketRef: React.MutableRefObject<WebSocket | null>) => {
  const [files, setFiles] = useState([{ name: "main.js", code: "" }]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [hiddenTabs, setHiddenTabs] = useState<number[]>([]);
  const [resizingSidebar, setResizingSidebar] = useState(false);
  const [resizingTerminal, setResizingTerminal] = useState(false);

const handleRun = () => {
  const code = files[activeFileIndex].code;
  const socket = socketRef.current;

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ code, language }));
  } else {
    console.warn("WebSocket is not open");
  }
};



  const updateCode = (value: string | undefined) => {
    setFiles((prevFiles) => {
      const updated = [...prevFiles];
      updated[activeFileIndex].code = value || "";
      return updated;
    });
  };

  const toggleTerminal = () => setTerminalVisible(!terminalVisible);

  const sidebarResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizingSidebar(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + e.clientX - startX);
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      setResizingSidebar(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const terminalResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizingTerminal(true);
    const startY = e.clientY;
    const startHeight = terminalHeight;

    const onMouseMove = (e: MouseEvent) => {
      const newHeight = Math.max(100, startHeight + (startY - e.clientY));
      setTerminalHeight(newHeight);
    };

    const onMouseUp = () => {
      setResizingTerminal(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return {
    files,
    activeFileIndex,
    language,
    sidebarWidth,
    terminalHeight,
    terminalVisible,
    setFiles,
    setActiveFileIndex,
    setLanguage,
    setTerminalVisible,
    setSidebarWidth,
    setTerminalHeight,
    hiddenTabs,
    setHiddenTabs,
    resizingSidebar,
    resizingTerminal,
    handleRun,
    updateCode,
    toggleTerminal,
    sidebarResizeMouseDown,
    terminalResizeMouseDown,
  };
};

export default useResizablePanels;