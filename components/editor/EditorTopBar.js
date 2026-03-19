"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ArrowLeftCircle,
  Clock,
  Eye,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { useEditor } from "@/hooks/use-editor";

const EditorTopBar = ({
  siteId,
  pageDetails,
  savePage,
  saving,
  pagesDropdown,
}) => {
  const router = useRouter();
  const { editor, dispatch } = useEditor();
  const [isLoading, setIsLoading] = React.useState(false);
  const [siteName, setSiteName] = React.useState(
    pageDetails?.name || "Untitled Page"
  );

  React.useEffect(() => {
    setSiteName(pageDetails?.name || "Untitled Page");
    dispatch({
      type: "SET_PAGE_ID",
      payload: { pageId: pageDetails?.id },
    });
  }, [pageDetails]);

  const handleBlurTitleChange = async (event) => {
    if (event.target.value === pageDetails?.name) return;
    if (event.target.value) {
      setSiteName(event.target.value);
      toast.success("Title updated!");
    } else {
      toast.error("You need to have a title!");
    }
  };

  const handlePreviewClick = () => {
    // Open preview in new tab showing the built site
    window.open(`/preview/${siteId}`, "_blank");
  };

  const handleUndo = () => dispatch({ type: "UNDO" });
  const handleRedo = () => dispatch({ type: "REDO" });

  const handleSave = async () => {
    setIsLoading(true);
    const content = JSON.stringify(editor.editor.elements);
    try {
      await savePage({
        pageId: pageDetails?.id,
        siteId,
        content,
        name: siteName,
      });
      dispatch({ type: "CLEAR_HISTORY" });
      toast.success("Saved successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Could not save. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    } else if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleUndo();
    } else if (event.key === "y" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleRedo();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editor]);

  return (
    <nav
      className={`
        border-b flex items-center justify-between
        px-4 py-2 gap-2 transition-all
        bg-black border-[#222222]
        ${editor.editor.previewMode ? "h-0 p-0 overflow-hidden" : ""}
      `}
    >
      {/* LEFT — Back + Site name + Pages dropdown */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[#aaaaaa] hover:text-white
          transition-colors flex-shrink-0"
          title="Back to dashboard"
        >
          <ArrowLeftCircle className="w-5 h-5" />
        </button>

        <div className="h-5 w-px bg-[#222222] flex-shrink-0" />

        {/* Site name */}
        <div className="flex flex-col min-w-0">
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            onBlur={handleBlurTitleChange}
            className="bg-transparent border-none text-white
            font-semibold text-sm outline-none
            hover:bg-[#111111] rounded px-1 py-0.5
            max-w-[120px]"
          />
          <span className="text-[#666666] text-[10px] flex
            items-center gap-1 px-1">
            <Clock className="w-2.5 h-2.5" />
            {pageDetails?.updatedAt
              ? format(new Date(pageDetails.updatedAt), "dd/MM/yy hh:mm a")
              : "Not saved yet"}
          </span>
        </div>

        <div className="h-5 w-px bg-[#222222] flex-shrink-0" />

        {/* Pages dropdown */}
        {pagesDropdown && (
          <div className="flex-shrink-0">
            {pagesDropdown}
          </div>
        )}
      </div>

      {/* MIDDLE — Device toggle */}
      <div className="flex items-center gap-1
        bg-[#111111] border border-[#222222]
        rounded-lg p-1 flex-shrink-0">
        {[
          { value: "Desktop", icon: <Laptop className="w-4 h-4" />, label: "Desktop" },
          { value: "Tablet", icon: <Tablet className="w-4 h-4" />, label: "Tablet" },
          { value: "Mobile", icon: <Smartphone className="w-4 h-4" />, label: "Mobile" },
        ].map((device) => (
          <button
            key={device.value}
            title={device.label}
            onClick={() =>
              dispatch({
                type: "CHANGE_DEVICE",
                payload: { device: device.value },
              })
            }
            className={`
              w-8 h-8 flex items-center justify-center
              rounded-md transition-all
              ${editor.editor.device === device.value
                ? "bg-white text-black"
                : "text-[#aaaaaa] hover:text-white hover:bg-[#111111]"
              }
            `}
          >
            {device.icon}
          </button>
        ))}
      </div>

      {/* RIGHT — Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Preview — opens in new tab */}
        <button
          onClick={handlePreviewClick}
          title="Preview site in new tab"
          className="w-8 h-8 flex items-center justify-center
          rounded-md border border-[#222222] text-[#aaaaaa]
          hover:text-white hover:border-white transition-all"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Undo */}
        <button
          onClick={handleUndo}
          disabled={editor.history.currentIndex <= 0}
          title="Undo (Ctrl+Z)"
          className="w-8 h-8 flex items-center justify-center
          rounded-md border border-[#222222] text-[#aaaaaa]
          hover:text-white hover:border-white transition-all
          disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={handleRedo}
          disabled={
            editor.history.currentIndex >=
            editor.history.history.length - 1
          }
          title="Redo (Ctrl+Y)"
          className="w-8 h-8 flex items-center justify-center
          rounded-md border border-[#222222] text-[#aaaaaa]
          hover:text-white hover:border-white transition-all
          disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#222222]" />

        {/* Demo Link */}
        <button className="px-3 h-8 rounded-md border
          border-[#222222] text-white text-xs
          font-medium hover:bg-[#111111] transition-all">
          Demo Link
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isLoading || saving}
          className="px-4 h-8 rounded-md bg-transparent border border-white
          text-white text-xs font-bold
          hover:bg-white hover:text-black transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || saving
            ? "Saving..."
            : `Save${editor.history.history.length > 1
                ? ` (${editor.history.history.length <= 50
                    ? editor.history.history.length
                    : "50+"})`
                : ""
              }`}
        </button>

        {/* Publish */}
        <button className="px-4 h-8 rounded-md
          bg-white text-black text-xs font-bold
          hover:bg-[#dddddd] transition-all">
          Publish
        </button>
      </div>
    </nav>
  );
};

export default EditorTopBar;