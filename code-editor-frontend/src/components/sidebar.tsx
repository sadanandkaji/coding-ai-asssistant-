import React, { useState, useRef, useEffect } from "react";
import { FiX, FiPlus } from "react-icons/fi";

type File = {
  name: string;
  code: string;
};

type SidebarProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setActiveFileIndex: (index: number) => void;
  setLanguage: (lang: string) => void;
  activeFileIndex: number;
  hiddenTabs: number[];
  setHiddenTabs: React.Dispatch<React.SetStateAction<number[]>>;
  width: number;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onAddFile: (filename: string) => void;
  onDeleteFile?: (index: number) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  files,
  setActiveFileIndex,
  activeFileIndex,
  hiddenTabs,
  setHiddenTabs,
  width,
  onResizeMouseDown,
  onAddFile,
  onDeleteFile,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const isValidFileName = (filename: string) => {
    const lower = filename.toLowerCase();
    const validExtensions = [".js", ".cpp", ".py", ".c"];
    return (
      filename.trim() !== "" &&
      filename.includes(".") &&
      validExtensions.some((ext) => lower.endsWith(ext)) &&
      !files.some((f) => f.name.toLowerCase() === lower)
    );
  };

  const confirmAddFile = () => {
    if (isValidFileName(newFileName)) {
      onAddFile(newFileName.trim());
      setNewFileName("");
      setIsAdding(false);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const cancelAddFile = () => {
    setNewFileName("");
    setIsAdding(false);
    setInputError(false);
  };

  return (
    <div className="flex h-full">
      <div style={{ width }} className="bg-zinc-800 p-2 overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div className="text-white font-bold">Files</div>
          <button
            onClick={() => {
              setIsAdding(true);
              setInputError(false);
            }}
            className="text-blue-400 hover:text-blue-600 font-bold text-lg select-none"
            title="Add new file"
            disabled={isAdding}
          >
            <FiPlus size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className={`cursor-pointer p-2 rounded hover:bg-zinc-700 flex justify-between items-center ${
                activeFileIndex === index ? "bg-zinc-700" : ""
              }`}
              onClick={() => {
                if (hiddenTabs.includes(index)) {
                  setHiddenTabs(hiddenTabs.filter((i) => i !== index));
                }
                setActiveFileIndex(index);
              }}
            >
              <span className="truncate">{file.name}</span>
              {onDeleteFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(index);
                  }}
                  className="text-red-400 hover:text-red-600 font-bold ml-2 select-none"
                  title={`Delete ${file.name}`}
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          ))}

          {isAdding && (
            <div className="mt-2 flex">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter new file name (e.g. script.js)"
                value={newFileName}
                onChange={(e) => {
                  setNewFileName(e.target.value);
                  if (inputError) {
                    setInputError(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmAddFile();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancelAddFile();
                  }
                }}
                onBlur={cancelAddFile}
                className={`flex-1 rounded px-2 py-1 bg-blue-100 text-blue-900 border ${
                  inputError ? "border-red-500" : "border-blue-400"
                } focus:outline-none focus:ring-2 ${
                  inputError ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              <button
                onClick={confirmAddFile}
                className="ml-2 p-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                title="Confirm add file"
              >
                Add
              </button>
              <button
                onClick={cancelAddFile}
                className="ml-1 p-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                title="Cancel"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        onMouseDown={onResizeMouseDown}
        className="w-2 cursor-col-resize bg-zinc-600 hover:bg-zinc-500"
      ></div>
    </div>
  );
};

export default Sidebar;
