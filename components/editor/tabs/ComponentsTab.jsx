"use client";

import React, { useState } from "react";
import {
  Type, Heading1, Image, Video, Link2, Box, Columns, GalleryHorizontal, MousePointerClick, LayoutGrid, List, FormInput, FileText, CheckSquare, ChevronDownSquare, Send, Code, Map, Timer, GalleryVertical, Folder, SlidersHorizontal, ShoppingCart, CreditCard, DollarSign, Package, Wind, View, Star, MessageSquare
} from "lucide-react";

// Section component with updated B&W styling
const Section = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#222222]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#aaaaaa] hover:text-white hover:bg-[#0a0a0a] transition-colors"
      >
        {title}
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 p-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Draggable component item
const ComponentItem = ({ type, name, icon }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center justify-center p-3 rounded-sm bg-[#0a0a0a] border border-[#222222] cursor-grab active:cursor-grabbing transition-all hover:border-white hover:bg-[#111111]"
    >
      {icon}
      <span className="mt-2 text-xs text-[#aaaaaa] text-center">{name}</span>
    </div>
  );
};

// ============================================================
// COMPONENT DEFINITIONS
// ============================================================
const COMPONENTS = {
  Layout: [
    { type: "section", name: "Section", icon: <Box className="w-6 h-6 text-white" /> },
    { type: "container", name: "Container", icon: <Box className="w-6 h-6 text-white stroke-1" /> },
    { type: "2Col", name: "2 Columns", icon: <Columns className="w-6 h-6 text-white" /> },
    { type: "3Col", name: "3 Columns", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M8 3v18M16 3v18"/></svg> },
    { type: "grid", name: "Grid", icon: <LayoutGrid className="w-6 h-6 text-white" /> },
    { type: "div", name: "Div Block", icon: <Box className="w-6 h-6 text-white dashed" /> },
  ],
  Basics: [
    { type: "heading", name: "Heading", icon: <Heading1 className="w-6 h-6 text-white" /> },
    { type: "text", name: "Paragraph", icon: <Type className="w-6 h-6 text-white" /> },
    { type: "link", name: "Link", icon: <Link2 className="w-6 h-6 text-white" /> },
    { type: "button", name: "Button", icon: <MousePointerClick className="w-6 h-6 text-white" /> },
    { type: "list", name: "List", icon: <List className="w-6 h-6 text-white" /> },
    { type: "icon", name: "Icon", icon: <Star className="w-6 h-6 text-white" /> },
  ],
  Media: [
    { type: "image", name: "Image", icon: <Image className="w-6 h-6 text-white" /> },
    { type: "video", name: "Video", icon: <Video className="w-6 h-6 text-white" /> },
    { type: "3D", name: "3D Model", icon: <View className="w-6 h-6 text-white" /> },
    { type: "lottie", name: "Lottie", icon: <Wind className="w-6 h-6 text-white" /> },
    { type: "gallery", name: "Gallery", icon: <GalleryHorizontal className="w-6 h-6 text-white" /> },
  ],
  Forms: [
    { type: "contactForm", name: "Form Block", icon: <Folder className="w-6 h-6 text-white" /> },
    { type: "input", name: "Input", icon: <FormInput className="w-6 h-6 text-white" /> },
    { type: "textarea", name: "Text Area", icon: <FileText className="w-6 h-6 text-white" /> },
    { type: "checkbox", name: "Checkbox", icon: <CheckSquare className="w-6 h-6 text-white" /> },
    { type: "select", name: "Select", icon: <ChevronDownSquare className="w-6 h-6 text-white" /> },
    { type: "submit", name: "Submit Button", icon: <Send className="w-6 h-6 text-white" /> },
  ],
  Advanced: [
    { type: "map", name: "Map", icon: <Map className="w-6 h-6 text-white" /> },
    { type: "countdown", name: "Countdown", icon: <Timer className="w-6 h-6 text-white" /> },
    { type: "tabs", name: "Tabs", icon: <GalleryVertical className="w-6 h-6 text-white" /> },
    { type: "accordion", name: "Accordion", icon: <SlidersHorizontal className="w-6 h-6 text-white" /> },
    { type: "customCode", name: "HTML Embed", icon: <Code className="w-6 h-6 text-white" /> },
    { type: "testimonial", name: "Testimonial", icon: <MessageSquare className="w-6 h-6 text-white" /> },
  ],
  'E-Commerce': [
    { type: "product-list", name: "Product List", icon: <Package className="w-6 h-6 text-white" /> },
    { type: "add-to-cart", name: "Add To Cart", icon: <ShoppingCart className="w-6 h-6 text-white" /> },
    { type: "cart-icon", name: "Cart Icon", icon: <ShoppingCart className="w-6 h-6 text-white stroke-1" /> },
    { type: "checkout-form", name: "Checkout", icon: <CreditCard className="w-6 h-6 text-white" /> },
    { type: "paymentForm", name: "Payment Form", icon: <DollarSign className="w-6 h-6 text-white" /> },
  ]
};

// ============================================================
// MAIN COMPONENTS TAB
// ============================================================
const ComponentsTab = () => {
  return (
    <div className="flex flex-col bg-black text-white h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#222222] bg-[#0a0a0a]">
        <h2 className="text-sm font-bold">Components</h2>
        <p className="text-[#aaaaaa] text-xs mt-1">Drag components to the canvas.</p>
      </div>

      {/* Components Sections */}
      <div className="flex-grow overflow-y-auto">
        {Object.entries(COMPONENTS).map(([category, items]) => (
          <Section key={category} title={category}>
            {items.map((item) => (
              <ComponentItem key={item.type} {...item} />
            ))}
          </Section>
        ))}
      </div>
    </div>
  );
};

export default ComponentsTab;