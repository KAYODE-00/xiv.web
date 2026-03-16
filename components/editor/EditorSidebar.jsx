"use client";

import React from "react";
import { Database, PlusCircle, Settings, SquareStack } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import SettingsTab from "@/components/editor/tabs/SettingsTab";
import MediaTab from "@/components/editor/tabs/MediaTabs";
import ComponentsTab from "@/components/editor/tabs/ComponentsTab";
import LayersTab from "@/components/editor/tabs/LayersTabs";

const TABS = [
  { value: "Settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
  { value: "Components", icon: <PlusCircle className="w-5 h-5" />, label: "Components" },
  { value: "Layers", icon: <SquareStack className="w-5 h-5" />, label: "Layers" },
  { value: "Media", icon: <Database className="w-5 h-5" />, label: "Media" },
];

const EditorSidebar = ({ siteId }) => {
  const { editor } = useEditor();
  const [activeTab, setActiveTab] = React.useState("Settings");

  React.useEffect(() => {
    const savedTab = localStorage.getItem("xiv-tab-name");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("xiv-tab-name", tab);
  };

  if (editor.editor.previewMode) return null;

  return (
    <div className="fixed right-0 top-[57px] h-[calc(100vh-57px)] flex z-[80] bg-[#0a0a0f]">

      {/* PANEL CONTENT — wide panel */}
      <div className="w-80 bg-[#0a0a0f] border-l border-[#1e1e2e] overflow-y-auto h-full">
        {activeTab === "Settings" && <SettingsTab />}
        {activeTab === "Media" && <MediaTab siteId={siteId} />}
        {activeTab === "Components" && <ComponentsTab />}
        {activeTab === "Layers" && <LayersTab />}
      </div>

      {/* TAB ICONS — narrow icon bar on far right */}
      <div className="w-14 bg-[#0a0a0f] border-l border-[#1e1e2e] flex flex-col items-center gap-2 py-3">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            title={tab.label}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border ${
              activeTab === tab.value
                ? "bg-[#6c63ff] border-[#6c63ff] text-white shadow-[0_0_0_2px_rgba(108,99,255,0.2)]"
                : "border-[#1e1e2e] text-[#8888aa] hover:text-[#f0f0f8] hover:border-[#6c63ff] hover:bg-white/5"
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EditorSidebar;
