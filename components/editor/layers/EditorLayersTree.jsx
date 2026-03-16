"use client";

import React from "react";
import EditorLayersTreeItem from "@/components/editor/layers/EditorLayersTreeItem";

const EditorLayersTree = ({
  data,
  onSelectChange,
  expandAll,
  className,
  ...props
}) => {
  const handleSelectChange = React.useCallback(
    (item) => {
      if (onSelectChange) {
        onSelectChange(item);
      }
    },
    [onSelectChange]
  );

  const expandedItemIds = React.useMemo(() => {
    const ids = [];

    function walkTreeItems(items) {
      if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
          ids.push(items[i].id);

          if (walkTreeItems(items[i]) && !expandAll) {
            return true;
          }

          if (!expandAll) ids.pop();
        }
      } else if (!expandAll) {
        return true;
      } else if (Array.isArray(items.content)) {
        return walkTreeItems(items.content);
      }
    }

    walkTreeItems(data);

    return ids;
  }, [data]);

  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <div className="overflow-auto">
        <div className="relative">
          <EditorLayersTreeItem
            data={data}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            {...props}
          />
        </div>
      </div>
    </div>
  );
};

EditorLayersTree.displayName = "EditorLayersTree";

export default EditorLayersTree;
