import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export default function CodeTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      convertEol: true,
      fontSize: 14,
      theme: { background: "#000000", foreground: "#ffffff" },
    });

    term.open(terminalRef.current);
    termRef.current = term;

    const socket = new WebSocket("ws://localhost:8000");

    socket.onopen = () => {
      term.write("🚀 Connected to Code Terminal\r\n");
    };

    term.onData((data) => {
      socket.send(data);
    });

    socket.onmessage = (event) => {
      term.write(event.data);
    };

    return () => {
      socket.close();
      term.dispose();
    };
  }, []);

return <div ref={terminalRef} className="w-full h-full" />;
}
