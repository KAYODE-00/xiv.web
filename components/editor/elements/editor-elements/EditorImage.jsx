"use client";

import React from "react";
import { Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useEditor } from "@/hooks/use-editor";
import { resolveElementStateStyles } from "@/lib/editor/utils";
import { getMotionProps, setupScrollAnimation } from "@/lib/editor/animations";
import { getScopedCss } from "@/lib/editor/runtime-styles";

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

const EditorImage = ({ element }) => {
  const { dispatch, editor: editorState } = useEditor();
  const { editor } = editorState;
  const device = editor.device;
  const [isHovering, setIsHovering] = React.useState(false);
  let deviceStyles = resolveElementStateStyles(element.styles, device, isHovering);
  const customCss = deviceStyles?.customCss || "";
  if (deviceStyles && Object.prototype.hasOwnProperty.call(deviceStyles, "customCss")) {
    delete deviceStyles.customCss;
  }

  const isSelected = editor.selectedElement.id === element.id;
  const isLive = editor.liveMode;
  const isPreview = editor.previewMode;
  const imageRef = React.useRef(null);
  const motionProps = getMotionProps(deviceStyles, isLive || isPreview);

  React.useEffect(() => {
    return setupScrollAnimation(imageRef.current, deviceStyles, isLive || isPreview);
  }, [
    deviceStyles?.scrollAnimation,
    deviceStyles?.animationDuration,
    deviceStyles?.animationDelay,
    isLive,
    isPreview,
  ]);

  const handleOnClickBody = (e) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleMove = (direction) => {
    const parent = findParent(editor.elements, element.id);
    if (!parent || !Array.isArray(parent.content)) return;
    const index = parent.content.findIndex((c) => c.id === element.id);
    if (index < 0) return;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= parent.content.length) return;
    const newContent = [...parent.content];
    [newContent[index], newContent[nextIndex]] = [
      newContent[nextIndex],
      newContent[index],
    ];
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: { elementDetails: { ...parent, content: newContent } },
    });
  };

  const parent = findParent(editor.elements, element.id);
  const index = parent?.content?.findIndex((c) => c.id === element.id) ?? -1;
  const canMoveUp = index > 0;
  const canMoveDown =
    index >= 0 && parent?.content && index < parent.content.length - 1;

  return (
    <motion.div
      ref={imageRef}
      initial={motionProps.initial}
      animate={motionProps.animate}
      transition={motionProps.transition}
      style={deviceStyles}
      data-xiv-id={element.id}
      draggable={!isLive}
      onClick={handleOnClickBody}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        p-0.5 w-full m-1 relative
        min-h-7 transition-all
        ${!isLive ? "border-dashed border border-gray-600" : ""}
        ${isSelected && !isLive
          ? "border-solid border-blue-500"
          : ""
        }
      `}
    >
      {customCss && (
        <style
          dangerouslySetInnerHTML={{
            __html: getScopedCss(element.id, customCss),
          }}
        />
      )}
      {/* Floating toolbar */}
      {isSelected && !isLive && !isPreview && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-8 left-2 flex items-center gap-1
          bg-[#0a0a0f] border border-[#6c63ff] text-white text-xs
          rounded-full px-2 py-1 z-20"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMove("up");
            }}
            disabled={!canMoveUp}
            className={`px-2 py-0.5 rounded-full transition-colors ${
              canMoveUp
                ? "hover:bg-[#6c63ff]/30"
                : "text-gray-500 cursor-not-allowed"
            }`}
          >
            ↑ Move Up
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMove("down");
            }}
            disabled={!canMoveDown}
            className={`px-2 py-0.5 rounded-full transition-colors ${
              canMoveDown
                ? "hover:bg-[#6c63ff]/30"
                : "text-gray-500 cursor-not-allowed"
            }`}
          >
            ↓ Move Down
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteElement();
            }}
            className="px-2 py-0.5 rounded-full hover:bg-[#6c63ff]/30 transition-colors"
          >
            🗑 Delete
          </button>
        </div>
      )}

      {/* Element name badge */}
      {isSelected && !isLive && (
        <div className="absolute -top-6 -left-0.5
          bg-[#6c63ff] text-white text-xs font-bold
          px-2 py-0.5 rounded-t-md z-10">
          {editor.selectedElement.name}
        </div>
      )}

      {/* Image */}
      {!Array.isArray(element.content) && element.content.src && (
        <img
          src={element.content.src}
          alt={element.content.alt || "Image"}
          style={deviceStyles}
          className="w-full h-auto"
        />
      )}

      {/* Placeholder when no image */}
      {!Array.isArray(element.content) && !element.content.src && !isLive && (
        <div className="w-full h-40 bg-[#111118] border
          border-dashed border-[#1e1e2e] rounded
          flex flex-col items-center justify-center
          text-gray-600 gap-2">
          <div className="text-3xl">🖼</div>
          <p className="text-xs">Add image URL in settings</p>
        </div>
      )}

      {/* Delete button */}
      {isSelected && !isLive && (
        <div
          onClick={handleDeleteElement}
          className="absolute -top-[25px] -right-[1px]
          bg-[#6c63ff] px-2 py-1 rounded-t-lg
          cursor-pointer z-10"
        >
          <Trash className="w-3 h-3 text-white" />
        </div>
      )}
    </motion.div>
  );
};

export default EditorImage;
