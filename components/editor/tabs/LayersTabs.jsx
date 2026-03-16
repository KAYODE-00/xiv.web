"use client";

import React from "react";
import { useEditor } from "@/hooks/use-editor";
import EditorLayersTree from "@/components/editor/layers/EditorLayersTree";

const LayersTab = () => {
  const { pageDetails, dispatch, editor } = useEditor();

  const [elements, setElements] = React.useState(() => {
    try {
      const parsed = JSON.parse(pageDetails?.content || "[]");
      return parsed[0]?.content || [];
    } catch {
      return [];
    }
  });

  const handleSelectElement = (element) => {
    if (element) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
  };

  React.useEffect(() => {
    if (editor.editor.elements.length) {
      setElements(editor.editor.elements);
    }
  }, [editor.editor.elements]);

  return (
    <div className="flex flex-col text-[#f0f0f8]">

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#8888aa]">
          Layers
        </div>
        <p className="text-[#8888aa] text-xs mt-1">
          View your page in a tree structure
        </p>
      </div>

      {/* Layers Tree */}
      <div className="px-4 py-4 overflow-auto min-h-[400px]">
        <EditorLayersTree
          data={elements}
          className="flex-shrink-0"
          onSelectChange={handleSelectElement}
        />
      </div>

    </div>
  );
};

export default LayersTab;
