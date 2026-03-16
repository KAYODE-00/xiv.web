"use client";

import React from "react";
import {
  AppWindowIcon,
  BoxIcon,
  BoxSelectIcon,
  Columns2Icon,
  Columns3Icon,
  CreditCardIcon,
} from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import EditorLayersTreeLeaf from "@/components/editor/layers/EditorLayersTreeLeaf";

const getIcon = (type) => {
  switch (type) {
    case "container": return BoxIcon;
    case "__body": return AppWindowIcon;
    case "2Col": return Columns2Icon;
    case "3Col": return Columns3Icon;
    case "section": return BoxSelectIcon;
    case "paymentForm": return CreditCardIcon;
    default: return undefined;
  }
};

const AccordionItem = ({
  item,
  expandedItemIds,
  handleSelectChange,
  selectedId,
}) => {
  const [open, setOpen] = React.useState(
    expandedItemIds.includes(item.id)
  );
  const Icon = getIcon(item.type);

  return (
    <div className="border-l border-[#1e1e2e]">
      {/* Trigger */}
      <button
        onClick={() => {
          setOpen(!open);
          handleSelectChange(item);
        }}
        className="w-full flex items-center justify-between
        p-3 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-2 w-full pr-2">
          {Icon && (
            <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
          )}
          <span className="text-sm text-gray-300 truncate flex-1">
            {item.name}
          </span>
          {item.id === selectedId && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          )}
          <span className="text-gray-600 text-xs">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="pl-4">
          {Array.isArray(item.content) && item.content.length > 0 ? (
            <EditorLayersTreeItem
              data={item.content}
              handleSelectChange={handleSelectChange}
              expandedItemIds={expandedItemIds}
            />
          ) : (
            <p className="text-gray-600 text-xs text-center py-2">
              No content inside
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const EditorLayersTreeItem = ({
  className,
  data,
  handleSelectChange,
  expandedItemIds,
  ...props
}) => {
  const { editor } = useEditor();
  const selectedId = editor.editor.selectedElement.id;

  return (
    <div role="tree" className={className || ""} {...props}>
      <ul>
        {Array.isArray(data) ? (
          data.map((item) => (
            <li key={item.id}>
              {Array.isArray(item.content) ? (
                <AccordionItem
                  item={item}
                  expandedItemIds={expandedItemIds}
                  handleSelectChange={handleSelectChange}
                  selectedId={selectedId}
                />
              ) : (
                <EditorLayersTreeLeaf
                  item={item}
                  isSelected={item.id === selectedId}
                  type={item.type}
                  onClick={() => handleSelectChange(item)}
                />
              )}
            </li>
          ))
        ) : (
          <li>
            <EditorLayersTreeLeaf
              item={data}
              isSelected={data.id === selectedId}
              type={data.type}
              onClick={() => handleSelectChange(data)}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

EditorLayersTreeItem.displayName = "EditorLayersTreeItem";

export default EditorLayersTreeItem;
