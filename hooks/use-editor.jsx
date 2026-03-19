
"use client";

import React from "react";
import { EditorContext } from "@/components/editor/EditorProvider";

// Hook to use EditorContext
export const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return {
    editor: context.state,
    dispatch: context.dispatch,
    siteId: context.siteId,
    pageDetails: context.pageDetails,
  };
};

// Add this helper to your use-editor.js or a separate utils file
export const updateElementStyle = (state, elementId, stylePath, value) => {
  return state.editor.elements.map((el) => {
    if (el.id === elementId) {
      // Create a deep copy to avoid mutation
      const newElement = JSON.parse(JSON.stringify(el));
      
      // Navigate to the style path (e.g., styles.desktop.base)
      const keys = stylePath.split('.');
      let current = newElement;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newElement;
    } else if (el.content && Array.isArray(el.content)) {
      return {
        ...el,
        content: updateElementStyle({ editor: { elements: el.content } }, elementId, stylePath, value)
      };
    }
    return el;
  });
};