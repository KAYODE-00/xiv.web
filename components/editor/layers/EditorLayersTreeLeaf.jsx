"use client";

import React from "react";
import {
  Contact2Icon,
  CreditCardIcon,
  ImageIcon,
  Link2Icon,
  TypeIcon,
  YoutubeIcon,
} from "lucide-react";

const getIcon = (type) => {
  switch (type) {
    case "text": return TypeIcon;
    case "video": return YoutubeIcon;
    case "link": return Link2Icon;
    case "image": return ImageIcon;
    case "contactForm": return Contact2Icon;
    case "paymentForm": return CreditCardIcon;
    default: return undefined;
  }
};

const EditorLayersTreeLeaf = ({
  className,
  item,
  isSelected,
  type,
  ...props
}) => {
  const Icon = getIcon(type);

  return (
    <div
      className={`
        flex items-center p-3 cursor-pointer
        border-l border-[#1e1e2e] w-full
        hover:bg-white/5 transition-colors
        ${isSelected ? "bg-[#6c63ff]/10 border-l-[#6c63ff]" : ""}
        ${className || ""}
      `}
      {...props}
    >
      {Icon && (
        <Icon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
      )}
      <span className="flex-1 text-sm text-gray-300 truncate">
        {item.name}
      </span>
      {isSelected && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
      )}
    </div>
  );
};

EditorLayersTreeLeaf.displayName = "EditorLayersTreeLeaf";

export default EditorLayersTreeLeaf;
