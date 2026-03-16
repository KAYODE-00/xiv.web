"use client";

import React from "react";
import { Trash } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import EditorRecursive from "./EditorRecursive";
import { resolveDeviceStyles } from "@/lib/editor/utils";

// Helper to find parent of an element
const findParent = (elements, targetId) => {
  for (const el of elements) {
    if (Array.isArray(el.content)) {
      if (el.content.find((c) => c.id === targetId)) {
        return el;
      }
      const found = findParent(el.content, targetId);
      if (found) return found;
    }
  }
  return null;
};

const EditorSection = ({ element }) => {
  const { content, type } = element;
  const { editor: editorState, dispatch } = useEditor();
  const { editor } = editorState;
  const device = editor.device;
  const deviceStyles = resolveDeviceStyles(element.styles, device);

  const isSelected = editor.selectedElement.id === element.id;
  const isLive = editor.liveMode;

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleOnClickBody = (e) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  // Move element up or down within its parent
  const handleMoveElement = (direction) => {
    const allElements = editor.elements;
    const parent = findParent(allElements, element.id);
    if (!parent || !Array.isArray(parent.content)) return;

    const index = parent.content.findIndex((c) => c.id === element.id);
    if (index === -1) return;

    const newContent = [...parent.content];

    if (direction === "up" && index > 0) {
      [newContent[index - 1], newContent[index]] =
        [newContent[index], newContent[index - 1]];
    } else if (direction === "down" && index < newContent.length - 1) {
      [newContent[index], newContent[index + 1]] =
        [newContent[index + 1], newContent[index]];
    } else {
      return;
    }

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...parent,
          content: newContent,
        },
      },
    });
  };

  const getSectionStyles = () => {
    let classes = "relative p-4 transition-all ";
    if (type === "container") classes += "h-fit m-4 ";
    if (type === "__body") classes += "h-full ";
    if (!isLive) classes += "border-dashed border border-gray-700 ";
    if (isSelected && !isLive) classes += "border-solid border-blue-500 ";
    return classes;
  };

  return (
    <section
      style={deviceStyles}
      className={getSectionStyles()}
      id="innerContainer"
      onClick={handleOnClickBody}
    >
      {/* Element name badge */}
      {isSelected && !isLive && (
        <div className="absolute -top-[23px] -left-[1px]
          bg-[#6c63ff] text-white text-xs font-bold
          px-2 py-0.5 rounded-t-lg z-10">
          {editor.selectedElement.name}
        </div>
      )}

      {/* Move up/down toolbar */}
      {isSelected && !isLive &&
        editor.selectedElement.type !== "__body" && (
          <div className="absolute -top-[23px] left-1/2
            -translate-x-1/2 flex items-center gap-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveElement("up");
              }}
              className="w-6 h-5 flex items-center justify-center
              bg-[#0a0a0f] border border-[#1e1e2e] rounded
              text-gray-400 hover:text-white hover:border-[#6c63ff]
              transition-all text-xs"
              title="Move up"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveElement("down");
              }}
              className="w-6 h-5 flex items-center justify-center
              bg-[#0a0a0f] border border-[#1e1e2e] rounded
              text-gray-400 hover:text-white hover:border-[#6c63ff]
              transition-all text-xs"
              title="Move down"
            >
              ↓
            </button>
          </div>
        )}

      {/* Render children */}
      {Array.isArray(content) &&
        content.map((childElement) => (
          <EditorRecursive
            key={childElement.id}
            element={childElement}
          />
        ))}

      {/* Empty drop hint */}
      {Array.isArray(content) &&
        content.length === 0 &&
        !isLive && (
          <div className="w-full min-h-[80px] flex items-center
            justify-center text-gray-700 text-xs
            border border-dashed border-gray-800 rounded">
            Drop elements here
          </div>
        )}

      {/* Delete button */}
      {isSelected &&
        !isLive &&
        editor.selectedElement.type !== "__body" && (
          <div
            onClick={handleDeleteElement}
            className="absolute -top-[25px] -right-[1px]
            bg-[#6c63ff] px-2 py-1 rounded-t-lg
            cursor-pointer z-10"
          >
            <Trash className="w-3 h-3 text-white" />
          </div>
        )}
    </section>
  );
};

export default EditorSection;
