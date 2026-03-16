import React from "react";
import { Box } from "lucide-react";

const ContainerPlaceholder = () => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("componentType", "container");
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
      <Box className="text-gray-400 w-8 h-8" />
    </div>
  );
};

export default ContainerPlaceholder;
