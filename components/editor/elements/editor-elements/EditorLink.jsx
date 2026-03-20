"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useEditor } from "@/hooks/use-editor";
import { formatTextOnKeyboard, resolveElementStateStyles } from "@/lib/editor/utils";
import { getSitePages } from "@/lib/actions/pages";
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

const EditorLink = ({ element }) => {
  const { dispatch, editor: editorState, siteId } = useEditor();
  const { editor } = editorState;
  const router = useRouter();
  const [pages, setPages] = React.useState([]);
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
  const linkRef = React.useRef(null);
  const motionProps = getMotionProps(deviceStyles, isLive || isPreview);

  React.useEffect(() => {
    return setupScrollAnimation(linkRef.current, deviceStyles, isLive || isPreview);
  }, [
    deviceStyles?.scrollAnimation,
    deviceStyles?.animationDuration,
    deviceStyles?.animationDelay,
    isLive,
    isPreview,
  ]);

  React.useEffect(() => {
    let isActive = true;
    if (!siteId) {
      setPages([]);
      return undefined;
    }
    const loadPages = async () => {
      try {
        const data = await getSitePages(siteId);
        if (isActive) setPages(data || []);
      } catch {
        if (isActive) setPages([]);
      }
    };
    loadPages();
    return () => { isActive = false; };
  }, [siteId]);

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

  const onKeyDown = (event) => {
    formatTextOnKeyboard(event, editor, dispatch);
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

  const handleLinkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log("=== LINK CLICKED ===");
    console.log("isPreview:", isPreview);
    console.log("isLive:", isLive);
    console.log("siteId:", siteId);
    console.log("pages loaded:", pages.length);
    console.log("pages:", pages.map(p => ({
      name: p.name,
      slug: p.slug,
      id: p.id
    })));

    if (!isPreview && !isLive) {
      console.log("Not in preview/live mode — skipping navigation");
      return;
    }

    const href = !Array.isArray(element.content)
      ? element.content.href || ""
      : "";

    console.log("href:", href);

    if (!href) {
      console.log("No href — skipping");
      return;
    }

    // External link
    if (href.startsWith("http")) {
      window.open(href, "_blank");
      return;
    }

    // Internal page link
    let slug = null;
    if (href.startsWith("/") && href !== "/") {
      slug = href.slice(1);
    } else if (href.startsWith("#") && href !== "#") {
      slug = href.slice(1);
    } else if (href === "/") {
      slug = "home";
    } else {
      console.log("Unrecognized href format:", href);
      return;
    }

    console.log("Looking for slug:", slug);

    const match = pages.find(
      (page) =>
        page.slug === slug ||
        page.slug?.startsWith(slug + "-") ||
        page.name?.toLowerCase() === slug ||
        page.name?.toLowerCase().replace(/\s+/g, "-") === slug ||
        (slug === "home" && (
          page.slug === "home" ||
          page.slug?.startsWith("home-")
        ))
    );

    console.log("Match found:", match);

    if (match) {
      const url = `/preview/${siteId}/${slug}`;
      console.log("Navigating to:", url);
      router.push(url);
    } else {
      console.warn(
        `No page found for "${href}".`,
        pages.map(p => ({ name: p.name, slug: p.slug }))
      );
    }
  };

  const href = !Array.isArray(element.content)
    ? element.content.href || "#"
    : "#";

  return (
    <motion.div
      ref={linkRef}
      initial={motionProps.initial}
      animate={motionProps.animate}
      transition={motionProps.transition}
      style={deviceStyles}
      data-xiv-id={element.id}
      draggable={!isLive}
      onClick={(e) => {
        if (isPreview || isLive) return;
        handleOnClickBody(e);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        p-0.5 w-full m-1 relative text-base
        min-h-7 transition-all underline-offset-4
        ${!isLive ? "border-dashed border border-gray-600" : ""}
        ${isSelected && !isLive ? "!border-solid !border-blue-500" : ""}
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

      {/* Preview / Live mode — real link */}
     {/* Preview / Live mode — real link */}
{/* Preview / Live mode */}
{!Array.isArray(element.content) && (isPreview || isLive) && (
  <button
    type="button"
    onClick={handleLinkClick}
    title={href}
    style={{
      background: "none",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
    }}
    className="underline text-blue-400
    hover:text-blue-300 transition-colors"
  >
    {element.content.innerText}
  </button>
)}

      {/* Editor mode — editable span */}
      {!isPreview && !isLive && (
        <span
          contentEditable
          className="outline-none underline
          text-blue-400 cursor-text"
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            dispatch({
              type: "UPDATE_ELEMENT",
              payload: {
                elementDetails: {
                  ...element,
                  content: {
                    ...(!Array.isArray(element.content) && element.content),
                    innerText: e.target.innerText,
                  },
                },
              },
            });
          }}
          suppressContentEditableWarning
        >
          {!Array.isArray(element.content) && element.content.innerText}
        </span>
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

export default EditorLink;
