import React from "react";
import { FiX } from "react-icons/fi";

type File = {
  name: string;
  code: string;
};

type TabBarProps = {
  files: File[];
  activeFileIndex: number;
  setActiveFileIndex: (index: number) => void;
  hiddenTabs: number[];
  setHiddenTabs: React.Dispatch<React.SetStateAction<number[]>>;
};

const TabBar: React.FC<TabBarProps> = ({
  files,
  activeFileIndex,
  setActiveFileIndex,
  hiddenTabs,
  setHiddenTabs,
}) => {
  const handleCloseTab = (index: number) => {
    setHiddenTabs([...hiddenTabs, index]);

    if (index === activeFileIndex) {
      // Find next visible tab after closing current active
      const visibleTabs = files
        .map((_, i) => i)
        .filter((i) => !hiddenTabs.includes(i) && i !== index);

      if (visibleTabs.length > 0) {
        setActiveFileIndex(visibleTabs[0]);
      } else {
        setActiveFileIndex(0);
      }
    }
  };

  return (
    <div className="flex bg-zinc-900 border-b border-zinc-700 overflow-x-auto">
      {files.map((file, index) => {
        const isActive = index === activeFileIndex;
        const isHidden = hiddenTabs.includes(index);

        if (isHidden) return null;

        return (
          <div
            key={index}
            className={`flex items-center px-4 py-2 cursor-pointer select-none whitespace-nowrap ${
              isActive
                ? "bg-zinc-700 text-white font-semibold"
                : "text-zinc-400 hover:bg-zinc-800"
            }`}
            onClick={() => setActiveFileIndex(index)}
          >
            <span>{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCloseTab(index);
              }}
              className="ml-2 text-red-400 hover:text-red-600 font-bold select-none"
              title={`Close ${file.name}`}
            >
              <FiX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;
