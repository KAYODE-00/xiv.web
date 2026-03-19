"use client";

import React from "react";
import { Trash, Copy, ArrowUp, ArrowDown, GripVertical, ClipboardPaste } from "lucide-react";
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

  // Resolve styles for the current device
  const getActiveStyles = () => {
    if (!styles) return {};
    const deviceStyles = styles[device] || styles.Desktop || styles;
    return { ...deviceStyles };
  };

  const handleOnDrop = (e) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType");
    if (componentType) {
      addVerifyElement(componentType, id, dispatch);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleOnClickBody = (e) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleAction = (type, payload) => {
    dispatch({ type, payload });
  };

  const moveChild = (fromIndex, toIndex) => {
    if (!Array.isArray(content) || toIndex < 0 || toIndex >= content.length) return;
    const newContent = [...content];
    const [moved] = newContent.splice(fromIndex, 1);
    newContent.splice(toIndex, 0, moved);
    handleAction('UPDATE_ELEMENT', {
      elementDetails: { ...element, content: newContent },
    });
  };

  const cloneWithNewIds = (node) => {
    const next = {
      ...node,
      id: crypto.randomUUID(),
    };
    if (Array.isArray(node.content)) {
      next.content = node.content.map(cloneWithNewIds);
    } else if (node.content && typeof node.content === "object") {
      next.content = { ...node.content };
    }
    if (node.styles && typeof node.styles === "object") {
      next.styles = JSON.parse(JSON.stringify(node.styles));
    }
    return next;
  };

  const copyChildToClipboard = (child) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("xiv-builder-element-clipboard", JSON.stringify(child));
  };

  const pasteChildFromClipboard = () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("xiv-builder-element-clipboard");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: cloneWithNewIds(parsed),
        },
      });
    } catch {
      window.localStorage.removeItem("xiv-builder-element-clipboard");
    }
  };
  
  const containerStyles = getActiveStyles();

  // Remove conflicting background properties if both exist
  if (containerStyles.background && containerStyles.backgroundImage) {
    delete containerStyles.background;
  }

  return (
    <div
      style={containerStyles}
      className={`relative transition-all ${
        isSelected && !isLive ? 'border-2 border-white' : isLive ? '' : 'border border-dashed border-[#222222]'
      } ${isBody ? 'w-full h-full overflow-auto' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
      onClick={handleOnClickBody}
    >
      {/* Element name badge */}
      {isSelected && !isLive && !isBody && (
        <div className="absolute -top-6 -left-[1px] bg-white text-black text-xs font-bold px-2 py-0.5 rounded-t-sm z-10">
          {element.name}
        </div>
      )}

      {isSelected && !isLive && (
        <div className="absolute -top-6 right-0 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              pasteChildFromClipboard();
            }}
            className="h-6 px-2 flex items-center gap-1 bg-black border border-[#333333] text-[#aaaaaa] hover:text-white hover:border-white text-[10px] font-semibold"
            title="Paste copied element"
          >
            <ClipboardPaste className="w-3 h-3" />
            Paste
          </button>
        </div>
      )}

      {/* Drop zone hint when empty */}
      {Array.isArray(content) && content.length === 0 && !isLive && (
        <div className="w-full min-h-[60px] flex items-center justify-center text-[#666666] text-xs">
          Drop elements here
        </div>
      )}

      {/* Render children */}
      {Array.isArray(content) && content.map((child, index) => (
        <div
          key={child.id}
          className="group/ctrl relative"
          onDrop={(e) => {
            e.stopPropagation();
            const from = dragIndexRef.current;
            if (from !== null && from !== index && !e.dataTransfer.getData("componentType")) {
              moveChild(from, index);
            }
            dragIndexRef.current = null;
          }}
        >
          {/* Editor mode with hover controls */}
          {!isLive && (
            <div className="absolute top-0 right-0 z-50 p-2 flex items-center gap-1.5 opacity-0 group-hover/ctrl:opacity-100 transition-opacity">
              {/* Controls Wrapper */}
              <div className="flex items-center gap-px p-1 rounded-sm bg-black border border-[#333333] shadow-lg">
                <button
                  onClick={(e) => { e.stopPropagation(); moveChild(index, index - 1); }}
                  className="w-7 h-7 flex items-center justify-center text-[#aaaaaa] hover:bg-[#222222] hover:text-white rounded-sm transition-all"
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveChild(index, index + 1); }}
                  className="w-7 h-7 flex items-center justify-center text-[#aaaaaa] hover:bg-[#222222] hover:text-white rounded-sm transition-all"
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div
                  draggable
                  onDragStart={(e) => { e.stopPropagation(); dragIndexRef.current = index; }}
                  onDragEnd={() => { dragIndexRef.current = null; }}
                  className="w-7 h-7 flex items-center justify-center text-[#aaaaaa] hover:bg-[#222222] hover:text-white rounded-sm transition-all cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
                 <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyChildToClipboard(child);
                    handleAction('DUPLICATE_ELEMENT', { elementDetails: child });
                  }}
                  className="w-7 h-7 flex items-center justify-center text-[#aaaaaa] hover:bg-[#222222] hover:text-white rounded-sm transition-all"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('DELETE_ELEMENT', { elementDetails: child });
                  }}
                  className="w-7 h-7 flex items-center justify-center text-[#aaaaaa] hover:bg-[#222222] hover:text-white rounded-sm transition-all"
                  title="Delete"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <EditorRecursive element={child} />

        </div>
      ))}
    </div>
  );
};

export default EditorContainer;