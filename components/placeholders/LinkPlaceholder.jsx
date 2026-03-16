import React from "react";
import { Link2Icon } from "lucide-react";

const LinkPlaceholder = () => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("componentType", "link");
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
      <Link2Icon className="text-gray-400 w-8 h-8" />
    </div>
  );
};

export default LinkPlaceholder;
