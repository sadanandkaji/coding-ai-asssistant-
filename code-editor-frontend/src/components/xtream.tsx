import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface CodeTerminalProps {
  socketRef: React.MutableRefObject<WebSocket | null>;
}

export default function CodeTerminal({ socketRef }: CodeTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [paddingBottom, setPaddingBottom] = useState(0);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      convertEol: true,
      fontSize: 14,
      scrollback: 1000,
      theme: {
        background: "#000000",
        foreground: "#cccccc",
      },
    });

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    termRef.current = term;

    const socket = new WebSocket("ws://localhost:8000");
    socketRef.current = socket;

    socket.onopen = () => {
      term.writeln("\x1b[32m🚀 Connected to Code Terminal\x1b[0m");
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "output" && Array.isArray(msg.lines)) {
          msg.lines.forEach((line: any) => {
            term.write(`\x1b[32m-> \x1b[37m${line.text}\x1b[0m\r\n`);
          });
        } else {
          term.writeln(event.data);
        }
      } catch {
        term.writeln(event.data);
      }
    };

    // Function to check terminal height and update padding
    const updatePadding = () => {
      if (!terminalRef.current) return;
      const height = terminalRef.current.clientHeight;
      const halfScreenHeight = window.innerHeight / 2;

      // If terminal height <= half screen height, add 150px padding at bottom, else 0
      setPaddingBottom(height <= halfScreenHeight ? 150 : 0);

      fitAddon.fit();
    };

    updatePadding();

    // Observe terminal container size changes
    const observer = new ResizeObserver(() => {
      updatePadding();
    });
    observer.observe(terminalRef.current);

    // Also listen for window resize
    window.addEventListener("resize", updatePadding);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePadding);
      socket.close();
      term.dispose();
    };
  }, [socketRef]);

  return (
    <div
      ref={terminalRef}
      className="w-full h-full overflow-y-auto"
      style={{ paddingBottom: `${paddingBottom}px` }}
    />
  );
}
