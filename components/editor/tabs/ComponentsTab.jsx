"use client";

import React from "react";
import {
  ELEMENT_LAYOUT_PLACEHOLDERS,
  ELEMENT_PRIMITIVE_PLACEHOLDERS,
} from "@/lib/editor/element-placeholders";

const Section = ({ title, children }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="border-b border-[#1e1e2e]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between
        px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]
        text-[#8888aa] hover:text-[#f0f0f8]
        hover:bg-[#111118] transition-colors"
      >
        {title}
        <span className="text-[#666689]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
};

const ComponentsTab = () => {
  return (
    <div className="flex flex-col text-[#f0f0f8]">

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#8888aa]">
          Components
        </div>
        <p className="text-[#8888aa] text-xs mt-1">
          Drag and drop components onto the canvas
        </p>
      </div>

      {/* Layout Section */}
      <Section title="Layout">
        {ELEMENT_LAYOUT_PLACEHOLDERS.map((element) => (
          <div
            key={element.id}
            className="flex flex-col items-center justify-center
            bg-[#111118] border border-[#1e1e2e] rounded-lg
            px-3 py-2 min-w-[92px] transition-colors
            hover:border-[#6c63ff] hover:bg-[#0f0f16]"
          >
            {element.placeholder}
            <span className="mt-1 text-[11px] text-[#8888aa]">
              {element.label}
            </span>
          </div>
        ))}
      </Section>

      {/* Elements Section */}
      <Section title="Elements">
        {ELEMENT_PRIMITIVE_PLACEHOLDERS.map((element) => (
          <div
            key={element.id}
            className="flex flex-col items-center justify-center
            bg-[#111118] border border-[#1e1e2e] rounded-lg
            px-3 py-2 min-w-[92px] transition-colors
            hover:border-[#6c63ff] hover:bg-[#0f0f16]"
          >
            {element.placeholder}
            <span className="mt-1 text-[11px] text-[#8888aa]">
              {element.label}
            </span>
          </div>
        ))}
      </Section>

    </div>
  );
};

export default ComponentsTab;
