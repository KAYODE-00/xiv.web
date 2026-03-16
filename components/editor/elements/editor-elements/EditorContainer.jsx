"use client";

import React from "react";
import { Trash } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import EditorRecursive from "./EditorRecursive";
import { addVerifyElement } from "@/lib/editor/add-verify-element";

const EditorContainer = ({ element }) => {
  const { content, id, styles, type } = element;
  const { dispatch, editor: editorState } = useEditor();
  const { editor } = editorState;

  const isSelected = editor.selectedElement.id === id;
  const isLive = editor.liveMode;
  const isBody = type === "__body";
  const device = editor.device;

  const dragIndexRef = React.useRef(null);
  const [dragOverIndex, setDragOverIndex] = React.useState(null);

  // Get styles for current device
  // Supports both flat styles and per-device styles
  const getActiveStyles = () => {
    if (!styles) return {};

    // Per-device styles format:
    // styles = { Desktop: {...}, Tablet: {...}, Mobile: {...} }
    if (styles.Desktop || styles.Tablet || styles.Mobile) {
      const deviceStyles = styles[device] || styles.Desktop || {};
      return { ...deviceStyles };
    }

    // Flat styles format (legacy): styles = { padding: "40px", ... }
    return { ...styles };
  };

  const handleOnDrop = (event) => {
    const componentType = event.dataTransfer.getData("componentType");
    if (componentType) {
      event.stopPropagation();
      addVerifyElement(componentType, id, dispatch);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleOnClickBody = (event) => {
    event.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleDeleteElement = (event) => {
    event.stopPropagation();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const moveSection = (fromIndex, toIndex) => {
    if (!Array.isArray(content)) return;
    if (toIndex < 0 || toIndex >= content.length) return;
    const newContent = [...content];
    const [moved] = newContent.splice(fromIndex, 1);
    newContent.splice(toIndex, 0, moved);
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: { ...element, content: newContent },
      },
    });
  };

  const getContainerStyles = () => {
    const activeStyles = getActiveStyles();
    let classes = "relative transition-all ";

    if (type === "container" || type === "2Col" || type === "3Col") {
      classes += "max-w-full w-full p-4 ";
    }
    if (type === "container") classes += "h-fit ";
    if (isBody) {
      classes += "h-full w-full overflow-y-auto overflow-x-hidden p-4 ";
    }

    // Only add flex classes if user hasn't set display in styles
    if (type === "2Col" && !activeStyles?.display) {
      classes += device === "Mobile"
        ? "flex flex-col "
        : "flex flex-row ";
    }
    if (type === "3Col" && !activeStyles?.display) {
      classes += device === "Mobile"
        ? "flex flex-col "
        : device === "Tablet"
        ? "flex flex-row flex-wrap "
        : "flex flex-row ";
    }

    if (!isLive && !editor.previewMode && isBody) classes += "mb-[200px] ";
    if (!isLive) classes += "border-dashed border border-gray-700 ";
    if (isSelected && !isLive) {
      classes += "border-solid ";
      classes += isBody
        ? "border-4 border-yellow-400 "
        : "border-blue-500 ";
    }
    return classes;
  };

  const getDeviceStyles = () => {
    const base = getActiveStyles();

    // Remove conflicting background properties
    if (base.background && base.backgroundImage) {
      delete base.background;
    }

    // Desktop — show exactly what user set
    if (device === "Desktop" || !device) return base;

    // Mobile overrides on top of user styles
    if (device === "Mobile") {
      if (base.display === "flex" && base.flexDirection !== "column") {
        base.flexDirection = "column";
      }
      if (base.padding) {
        const val = parseInt(base.padding);
        if (!isNaN(val) && val > 16) base.padding = "16px";
      }
      if (base.paddingTop) {
        const val = parseInt(base.paddingTop);
        if (!isNaN(val) && val > 24) base.paddingTop = "24px";
      }
      if (base.paddingBottom) {
        const val = parseInt(base.paddingBottom);
        if (!isNaN(val) && val > 24) base.paddingBottom = "24px";
      }
      if (base.paddingLeft) {
        const val = parseInt(base.paddingLeft);
        if (!isNaN(val) && val > 16) base.paddingLeft = "16px";
      }
      if (base.paddingRight) {
        const val = parseInt(base.paddingRight);
        if (!isNaN(val) && val > 16) base.paddingRight = "16px";
      }
      if (base.fontSize) {
        const val = parseInt(base.fontSize);
        if (!isNaN(val) && val > 16) {
          base.fontSize = `${Math.max(Math.round(val * 0.75), 12)}px`;
        }
      }
      if (base.width && base.width !== "100%") base.width = "100%";
      if (base.height && base.height !== "auto" && base.height !== "100%") {
        const val = parseInt(base.height);
        if (!isNaN(val) && val > 300) base.height = "auto";
      }
      return base;
    }

    // Tablet overrides
    if (device === "Tablet") {
      if (base.display === "flex" && base.flexDirection === "row") {
        base.flexWrap = "wrap";
      }
      if (base.padding) {
        const val = parseInt(base.padding);
        if (!isNaN(val) && val > 40) base.padding = "40px";
      }
      if (base.fontSize) {
        const val = parseInt(base.fontSize);
        if (!isNaN(val) && val > 48) {
          base.fontSize = `${Math.round(val * 0.85)}px`;
        }
      }
      return base;
    }

    return base;
  };

  return (
    <div
      style={getDeviceStyles()}
      className={getContainerStyles()}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
      onClick={handleOnClickBody}
    >
      {/* Element name badge */}
      {isSelected && !isLive && (
        <div className="absolute -top-6 -left-0.5
          bg-[#6c63ff] text-white text-xs font-bold
          px-2 py-0.5 rounded-t-md z-10">
          {element.name}
        </div>
      )}

      {/* Drop zone hint when empty */}
      {Array.isArray(content) && content.length === 0 && !isLive && (
        <div className="w-full min-h-[60px] flex items-center
          justify-center text-gray-600 text-xs
          border border-dashed border-gray-700 rounded">
          Drop elements here
        </div>
      )}

      {/* Render children */}
      {Array.isArray(content) && content.map((child, index) => (
        <div
          key={child.id}
          className="relative"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOverIndex(index);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            const from = dragIndexRef.current;
            if (
              from !== null &&
              from !== undefined &&
              from !== index &&
              e.dataTransfer.getData("componentType") === ""
            ) {
              moveSection(from, index);
            }
            dragIndexRef.current = null;
            setDragOverIndex(null);
          }}
        >
          {/* Drop indicator */}
          {dragOverIndex === index && dragIndexRef.current !== null && (
            <div className="h-0.5 bg-[#6c63ff] rounded
              mx-2 mb-1 transition-all" />
          )}

          {/* Editor mode with hover controls */}
          {!isLive && (
            <div className="group/ctrl relative">
              <div
                className="absolute top-1 right-1 z-50
                flex items-center gap-1
                opacity-0 group-hover/ctrl:opacity-100
                transition-opacity pointer-events-none
                group-hover/ctrl:pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Move up */}
                {index > 0 && (
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      moveSection(index, index - 1);
                    }}
                    className="w-6 h-6 flex items-center justify-center
                    bg-[#0a0a0f]/90 backdrop-blur-sm
                    border border-[#6c63ff]/50 rounded
                    text-[#6c63ff] hover:bg-[#6c63ff]
                    hover:text-white transition-all text-xs
                    font-bold shadow-lg"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}

                {/* Move down */}
                {index < content.length - 1 && (
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      moveSection(index, index + 1);
                    }}
                    className="w-6 h-6 flex items-center justify-center
                    bg-[#0a0a0f]/90 backdrop-blur-sm
                    border border-[#6c63ff]/50 rounded
                    text-[#6c63ff] hover:bg-[#6c63ff]
                    hover:text-white transition-all text-xs
                    font-bold shadow-lg"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}

                {/* Drag handle */}
                <div
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    dragIndexRef.current = index;
                    e.dataTransfer.setData("componentType", "");
                    e.dataTransfer.setData("reorder", String(index));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => {
                    dragIndexRef.current = null;
                    setDragOverIndex(null);
                  }}
                  className="w-6 h-6 flex items-center justify-center
                  bg-[#0a0a0f]/90 backdrop-blur-sm
                  border border-[#1e1e2e] rounded
                  text-gray-400 hover:text-white
                  cursor-grab active:cursor-grabbing
                  shadow-lg text-xs select-none"
                  title="Drag to reorder"
                >
                  ⠿
                </div>
              </div>

              <EditorRecursive element={child} />
            </div>
          )}

          {/* Live mode */}
          {isLive && <EditorRecursive element={child} />}
        </div>
      ))}

      {/* Delete button */}
      {isSelected && !isLive && !isBody && (
        <div
          onClick={handleDeleteElement}
          className="absolute -top-[25px] -right-[1px]
          bg-[#6c63ff] px-2 py-1 rounded-t-lg
          cursor-pointer z-10"
        >
          <Trash className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default EditorContainer;
