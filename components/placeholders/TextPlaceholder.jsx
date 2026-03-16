import React from "react";
import { TypeIcon } from "lucide-react";

const TextPlaceholder = () => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("componentType", "text");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="h-14 w-14 bg-[#111118] border border-[#1e1e2e]
      rounded-md flex items-center justify-center
      cursor-grab hover:border-[#6c63ff] hover:bg-[#6c63ff]/10
      transition-all"
    >
      <TypeIcon className="text-gray-400 w-8 h-8" />
    </div>
  );
};

export default TextPlaceholder;
