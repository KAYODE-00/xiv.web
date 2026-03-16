"use client";

import React from "react";
import { EyeOff } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import EditorRecursive from "./elements/editor-elements/EditorRecursive";

const Editor = ({ pageId, liveMode, pageDetails }) => {
  const { editor, dispatch } = useEditor();

  React.useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode, dispatch]);

  React.useEffect(() => {
    if (!pageDetails) return undefined;
    dispatch({
      type: "LOAD_DATA",
      payload: {
        elements: pageDetails.content
          ? JSON.parse(pageDetails.content)
          : "",
        withLive: !!liveMode,
      },
    });
  }, [pageId, pageDetails, liveMode, dispatch]);

  const handleClickElement = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handlePreview = () => {
    dispatch({ type: "TOGGLE_LIVE_MODE" });
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
  };

  const isPreviewOrLive =
    editor.editor.previewMode || editor.editor.liveMode;
  const device = editor.editor.device;

  return (
    <div
      className={`
        flex-1 h-screen overflow-y-auto overflow-x-hidden
        bg-[#111118] transition-all
        ${isPreviewOrLive ? "" : "mr-[385px]"}
      `}
      onClick={handleClickElement}
    >
      {/* Exit preview button */}
      {editor.editor.previewMode && editor.editor.liveMode && (
        <button
          className="fixed top-4 left-4 z-[100]
          bg-white border border-gray-200
          rounded-md p-2 hover:bg-gray-100
          transition-colors shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            handlePreview();
          }}
          title="Back to editor"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      )}

      {/* Device frame wrapper */}
      <div
        data-device={device}
        className={`
          transition-all   duration-300 
          ${device === "Mobile"
            ? "w-[390px] mx-auto shadow-2xl shadow-black/50 my-4 rounded-xl overflow-hidden border border-gray-200"
            : device === "Tablet"
            ? "w-[768px] mx-auto shadow-2xl shadow-black/50 my-4 rounded-lg overflow-hidden border border-gray-200"
            : "w-full"
          }
        `}
      >
        {/* Mobile notch decoration */}
        {device === "Mobile" && !isPreviewOrLive && (
          <div className="bg-gray-50 px-4 py-2 flex items-center
            justify-center border-b border-gray-200
            sticky top-0 z-10">
            <div className="w-20 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Tablet bar decoration */}
        {device === "Tablet" && !isPreviewOrLive && (
          <div className="bg-gray-50 px-4 py-1.5 flex items-center
            justify-center border-b border-gray-200
            sticky top-0 z-10">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Page content */}
        <div className={!isPreviewOrLive ? "pb-[200px]" : ""}>
          {Array.isArray(editor.editor.elements) &&
            editor.editor.elements.map((element) => (
              <EditorRecursive
                key={element.id}
                element={element}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;