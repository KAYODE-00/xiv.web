import React from "react";
import { Youtube } from "lucide-react";

const VideoPlaceholder = () => {
  const handleDragStart = (event) => {
    event.dataTransfer.setData("componentType", "video");
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
      <Youtube className="text-gray-400 w-8 h-8" />
    </div>
  );
};

export default VideoPlaceholder;
