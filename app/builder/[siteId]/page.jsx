"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditorProvider from "@/components/editor/EditorProvider";
import EditorTopBar from "@/components/editor/EditorTopBar";
import Editor from "@/components/editor/editor";
import EditorSidebar from "@/components/editor/EditorSidebar";
import { getSite } from "@/lib/actions/sites";
import { savePage, createPage, deletePage } from "@/lib/actions/pages";

const defaultContent = JSON.stringify([
  {
    content: [],
    id: "__body",
    name: "Body",
    styles: {},
    type: "__body",
  },
]);

// ============================================================
// PAGES DROPDOWN COMPONENT
// ============================================================
const PagesDropdown = ({
  pages,
  currentPage,
  onSelectPage,
  onCreatePage,
  onDeletePage,
}) => {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setCreating(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreatePage = async () => {
    if (!newPageName.trim()) return;
    setLoading(true);
    try {
      await onCreatePage(newPageName.trim());
      setNewPageName("");
      setCreating(false);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreatePage();
    if (e.key === "Escape") {
      setCreating(false);
      setNewPageName("");
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5
        rounded-md border border-[#1e1e2e] bg-[#111118]
        text-white text-sm font-medium
        hover:border-[#6c63ff] transition-all"
      >
        <span>📄</span>
        <span className="max-w-[120px] truncate">
          {currentPage?.name || "Select Page"}
        </span>
        <span className="text-gray-500 text-xs">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56
          bg-[#111118] border border-[#1e1e2e] rounded-lg
          shadow-xl shadow-black/50 z-[200] overflow-hidden">

          {/* Pages list */}
          <div className="max-h-48 overflow-y-auto">
            {pages.length === 0 && (
              <div className="px-4 py-3 text-gray-500 text-xs">
                No pages yet
              </div>
            )}
            {pages.map((page) => {
              const isActive = page.id === currentPage?.id;
              return (
                <div
                  key={page.id}
                  className={`
                    flex items-center justify-between
                    px-3 py-2 cursor-pointer group
                    transition-colors
                    ${isActive
                      ? "bg-[#6c63ff]/20 text-white"
                      : "text-gray-300 hover:bg-white/5"
                    }
                  `}
                >
                  <div
                    className="flex items-center gap-2 flex-1"
                    onClick={() => {
                      onSelectPage(page);
                      setOpen(false);
                    }}
                  >
                    <span className="text-sm">📄</span>
                    <span className="text-sm truncate">{page.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full
                        bg-[#6c63ff] flex-shrink-0" />
                    )}
                  </div>

                  {pages.length > 1 && !isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(
                          `Delete "${page.name}"? This cannot be undone.`
                        )) {
                          onDeletePage(page.id);
                          setOpen(false);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100
                      text-red-400 hover:text-red-300
                      p-1 rounded transition-all text-xs"
                      title="Delete page"
                    >
                      🗑
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#1e1e2e]" />

          {creating ? (
            <div className="p-3 flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Page name..."
                className="w-full px-3 py-1.5 rounded-md
                bg-[#0a0a0f] border border-[#1e1e2e]
                text-white text-sm outline-none
                focus:border-[#6c63ff] transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreatePage}
                  disabled={loading || !newPageName.trim()}
                  className="flex-1 py-1.5 rounded-md
                  bg-[#6c63ff] text-white text-xs
                  font-semibold hover:bg-[#7c74ff]
                  disabled:opacity-50 transition-all"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => {
                    setCreating(false);
                    setNewPageName("");
                  }}
                  className="px-3 py-1.5 rounded-md
                  border border-[#1e1e2e] text-gray-400
                  text-xs hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2
              px-4 py-2.5 text-sm text-gray-400
              hover:bg-white/5 hover:text-white
              transition-colors"
            >
              <span className="text-[#6c63ff] font-bold">+</span>
              Add New Page
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// INNER BUILDER — needs Suspense for useSearchParams
// ============================================================
const BuilderInner = ({ siteId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIdFromUrl = searchParams.get("page");

  const [allPages, setAllPages] = useState([]);
  const [pageDetails, setPageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initial load
  useEffect(() => {
    const fetchSite = async () => {
      try {
        const site = await getSite(siteId);
        if (site?.pages?.length > 0) {
          setAllPages(site.pages);
          // Load page from URL or default to first
          if (pageIdFromUrl) {
            const target = site.pages.find(p => p.id === pageIdFromUrl);
            setPageDetails(target || site.pages[0]);
          } else {
            setPageDetails(site.pages[0]);
          }
        } else {
          const fallback = {
            id: "test-page",
            name: "Home",
            content: defaultContent,
            updatedAt: "2024-01-01T00:00:00.000Z",
          };
          setAllPages([fallback]);
          setPageDetails(fallback);
        }
      } catch {
        const fallback = {
          id: "test-page",
          name: "Home",
          content: defaultContent,
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        setAllPages([fallback]);
        setPageDetails(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [siteId]);

  // Watch URL ?page= changes
  // Fires when EditorLink navigates in preview mode
  useEffect(() => {
    if (!pageIdFromUrl || allPages.length === 0) return;
    const target = allPages.find(p => p.id === pageIdFromUrl);
    if (target && target.id !== pageDetails?.id) {
      setPageDetails(target);
    }
  }, [pageIdFromUrl, allPages]);

  const handleSavePage = async ({
    pageId,
    siteId: saveSiteId,
    content,
    name,
  }) => {
    const isUuid =
      typeof pageId === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        pageId
      );
    if (!isUuid) {
      console.warn("Save skipped: invalid page id", pageId);
      return;
    }
    setSaving(true);
    try {
      await savePage({ pageId, siteId: saveSiteId, content, name });
      setAllPages(prev =>
        prev.map(p => p.id === pageId ? { ...p, content, name } : p)
      );
    } catch (err) {
      console.error("Save error:", err?.message || err);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPage = (page) => {
    if (page.id === pageDetails?.id) return;
    router.push(`/builder/${siteId}?page=${page.id}`);
    setPageDetails(page);
  };

  const handleCreatePage = async (name) => {
    try {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const newPage = await createPage({
        siteId,
        name,
        slug: `${slug}-${Date.now()}`,
      });

      setAllPages(prev => [...prev, newPage]);
      router.push(`/builder/${siteId}?page=${newPage.id}`);
      setPageDetails(newPage);
    } catch (err) {
      console.error("Create page error:", err);
      if (err?.code) {
        console.error("Supabase error details:", {
          code: err.code,
          message: err.message,
          details: err.details,
          hint: err.hint,
        });
      }
    }
  };

  const handleDeletePage = async (pageId) => {
    try {
      await deletePage(pageId);
      const remaining = allPages.filter(p => p.id !== pageId);
      setAllPages(remaining);
      if (pageDetails?.id === pageId && remaining.length > 0) {
        router.push(`/builder/${siteId}?page=${remaining[0].id}`);
        setPageDetails(remaining[0]);
      }
    } catch (err) {
      console.error("Delete page error:", err?.message || err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center
        bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#6c63ff]
            border-t-transparent rounded-full animate-spin"
          />
          <p className="text-gray-500 text-sm">Loading builder...</p>
        </div>
      </div>
    );
  }

  if (!pageDetails) return null;

  return (
    <EditorProvider siteId={siteId} pageDetails={pageDetails}>
      <div className="flex flex-col h-screen overflow-hidden
        bg-[#0a0a0f]">
        <EditorTopBar
          siteId={siteId}
          pageDetails={pageDetails}
          savePage={handleSavePage}
          saving={saving}
          pagesDropdown={
            <PagesDropdown
              pages={allPages}
              currentPage={pageDetails}
              onSelectPage={handleSelectPage}
              onCreatePage={handleCreatePage}
              onDeletePage={handleDeletePage}
            />
          }
        />
        <div className="flex flex-1  overflow-hidden relative">
          <Editor
            key={pageDetails.id}
            pageId={pageDetails.id}
            pageDetails={pageDetails}
            liveMode={false}
          />
          <EditorSidebar siteId={siteId} />
        </div>
      </div>
    </EditorProvider>
  );
};

// ============================================================
// MAIN BUILDER PAGE — wraps inner in Suspense
// ============================================================
const BuilderPage = ({ params }) => {
  const resolvedParams = React.use(params);
  const siteId = resolvedParams?.siteId || "test";

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center
          bg-[#0a0a0f]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#6c63ff]
              border-t-transparent rounded-full animate-spin"
            />
            <p className="text-gray-500 text-sm">Loading builder...</p>
          </div>
        </div>
      }
    >
      <BuilderInner siteId={siteId} />
    </Suspense>
  );
};

export default BuilderPage;
