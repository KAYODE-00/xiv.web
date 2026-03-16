"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSite } from "@/lib/actions/sites";
import EditorRecursive from "@/components/editor/elements/editor-elements/EditorRecursive";
import EditorProvider from "@/components/editor/EditorProvider";
import { useEditor } from "@/hooks/use-editor";

const LiveModeInitializer = () => {
  const { dispatch } = useEditor();

  useEffect(() => {
    const getDevice = () => {
      const width = window.innerWidth;
      if (width <= 480) return "Mobile";
      if (width <= 768) return "Tablet";
      return "Desktop";
    };

    // Enable live mode
    dispatch({
      type: "TOGGLE_LIVE_MODE",
      payload: { value: true },
    });

    // Set device based on actual screen width
    dispatch({
      type: "CHANGE_DEVICE",
      payload: { device: getDevice() },
    });

    // Update device on window resize
    const handleResize = () => {
      dispatch({
        type: "CHANGE_DEVICE",
        payload: { device: getDevice() },
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return null;
};

const PageContent = ({ elements }) => {
  return (
    <div className="min-h-screen">
      <LiveModeInitializer />
      {elements.map((element) => (
        <EditorRecursive
          key={element.id}
          element={element}
        />
      ))}
    </div>
  );
};

const PreviewPage = () => {
  const params = useParams();
  const siteId = params?.siteId;
  const slugParts = params?.slug || [];
  const pageSlug = slugParts[0] || "home";

  const [pageDetails, setPageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const site = await getSite(siteId);
        if (!site?.pages?.length) {
          setNotFound(true);
          return;
        }

        const match =
          site.pages.find(
            (p) =>
              p.slug === pageSlug ||
              p.slug?.startsWith(pageSlug + "-") ||
              p.name?.toLowerCase() === pageSlug ||
              p.name?.toLowerCase().replace(/\s+/g, "-") === pageSlug ||
              (pageSlug === "home" && (
                p.slug === "home" ||
                p.slug?.startsWith("home-")
              ))
          ) || site.pages[0];

        setPageDetails(match);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (siteId) fetchPage();
  }, [siteId, pageSlug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center
        justify-center bg-white">
        <div className="w-6 h-6 border-2 border-gray-300
          border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !pageDetails) {
    return (
      <div className="flex h-screen items-center
        justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Page not found
          </h1>
          <p className="text-gray-500 mt-2">
            This page doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const elements = (() => {
    try {
      return JSON.parse(pageDetails.content || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <EditorProvider
      siteId={siteId}
      pageDetails={pageDetails}
    >
      <PageContent elements={elements} />
    </EditorProvider>
  );
};

export default PreviewPage;