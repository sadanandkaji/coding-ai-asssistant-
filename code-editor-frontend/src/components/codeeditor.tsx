import Editor from "@monaco-editor/react";

interface CodeEditorWindowProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  theme: string;
}

const CodeEditorWindow = ({
  code,
  onChange,
  language,
  theme,
}: CodeEditorWindowProps) => {
  return (
    <div style={{ height: "100%" }}>
      <Editor
        height="100%"         // fill parent container height
        width="100%"
        language={language || "javascript"}
        value={code}
        theme={theme}
        defaultValue="// write here"
        onChange={(value) => onChange(value || "")}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
