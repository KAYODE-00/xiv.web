"use client";

import React, { useState, useEffect } from "react";
import {
  AlignCenter, AlignHorizontalJustifyCenterIcon, AlignHorizontalJustifyEnd, AlignHorizontalJustifyStart, AlignHorizontalSpaceAround, AlignHorizontalSpaceBetween, AlignLeft, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalJustifyStart, ChevronsUpDown, Code, Droplets, Expand, Eye, EyeOff, Italic, Layers, MousePointerClick, Move, Palette, Plus, RotateCw, Scale, Shrink, Sparkles, Trash2, Type, Underline, Waves, Wind
} from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import { getSitePages } from "@/lib/actions/pages";
import { GOOGLE_FONTS } from "@/config/editor"; // We will create this file later

// ============================================================
// REUSABLE UI COMPONENTS (Strict Black & White Theme)
// ============================================================

const Label = ({ children, className = "" }) => (
  <label className={`text-xs font-medium text-[#aaaaaa] ${className}`}>
    {children}
  </label>
);

const Input = ({ id, placeholder, onChange, value, type = "text", className = "" }) => (
  <input
    id={id}
    placeholder={placeholder}
    onChange={onChange || (() => {})}
    value={value ?? ""}
    type={type}
    className={`w-full px-2.5 py-1 text-sm rounded bg-black border border-[#222222] text-white placeholder:text-[#666666] outline-none focus:border-white transition-all ${className}`}
  />
);

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
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
        <div className="px-4 pb-4 pt-2 flex flex-col gap-4">
          {children}
        </div>
      )}
    </div>
  );
};

const ToggleBtnGroup = ({ options, value, onChange, title }) => (
  <div>
    {title && <Label>{title}</Label>}
    <div className="flex gap-1 mt-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          title={opt.title}
          onClick={() => onChange(opt.value)}
          className={`flex-1 h-8 flex items-center justify-center rounded transition-all border ${
            value === opt.value
              ? "bg-white text-black border-white"
              : "border-[#222222] text-[#aaaaaa] hover:text-white hover:border-[#333333] hover:bg-[#111111]"
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  </div>
);

const SelectInput = ({ value, onChange, options, placeholder }) => (
  <div className="relative w-full">
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none px-2.5 py-1 text-sm rounded bg-black border border-[#222222] text-white outline-none focus:border-white transition-all"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronsUpDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none" />
  </div>
);

const SliderInput = ({ value, onChange, max = 100, min = 0, step = 1, unit = "" }) => {
  const numValue = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0
    : value || 0;

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numValue}
        onChange={(e) => onChange(`${e.target.value}${unit}`)}
        className="w-full accent-white"
      />
      <div className="w-20">
        <Input 
          value={`${numValue}${unit}`} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    </div>
  );
};

const ColorInput = ({ value, onChange, label }) => {
  const isHex = typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
  const safeValue = isHex ? value : "#ffffff";

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded border border-[#222222] bg-[#111111] overflow-hidden">
          <input
            type="color"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-1 -left-1 w-10 h-10 cursor-pointer"
          />
        </div>
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
};

const FourWayInput = ({ label, values, onChange }) => {
    const sides = ['Top', 'Right', 'Bottom', 'Left'];
    const keys = [`${label}Top`, `${label}Right`, `${label}Bottom`, `${label}Left`];
    return (
        <div className="flex flex-col gap-2">
            <Label>{label.charAt(0).toUpperCase() + label.slice(1)} (px)</Label>
            <div className="grid grid-cols-2 gap-2">
                {sides.map((side, i) => (
                    <div key={side} className="flex flex-col gap-1">
                        <Label className="text-[#666666]">{side}</Label>
                        <Input
                            id={keys[i]}
                            placeholder="0"
                            onChange={onChange}
                            value={values[keys[i]]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const BoxShadowBuilder = ({ value, onChange }) => {
    const shadows = value ? value.split(', ') : ['0px 0px 0px 0px #000000'];
    // For simplicity, we edit the first shadow only in this UI
    const firstShadow = shadows[0];
    const parts = firstShadow.match(/(-?\d+px)|(#?\w+)/g) || ['0px', '0px', '0px', '0px', '#000000'];
    const [hOffset, vOffset, blur, spread, color] = parts;

    const updateShadow = (part, newValue) => {
        const newParts = { hOffset, vOffset, blur, spread, color };
        newParts[part] = newValue;
        onChange(`${newParts.hOffset} ${newParts.vOffset} ${newParts.blur} ${newParts.spread} ${newParts.color}`);
    };

    return (
        <div className="flex flex-col gap-3 p-3 rounded bg-[#0a0a0a] border border-[#222222]">
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                    <Label>H-Offset</Label>
                    <Input value={hOffset} onChange={(e) => updateShadow('hOffset', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                    <Label>V-Offset</Label>
                    <Input value={vOffset} onChange={(e) => updateShadow('vOffset', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                    <Label>Blur</Label>
                    <Input value={blur} onChange={(e) => updateShadow('blur', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                    <Label>Spread</Label>
                    <Input value={spread} onChange={(e) => updateShadow('spread', e.target.value)} />
                </div>
            </div>
            <ColorInput value={color} onChange={(v) => updateShadow('color', v)} />
        </div>
    );
};

// ============================================================
// MAIN SETTINGS TAB
// ============================================================
const SettingsTab = () => {
  const { editor, dispatch, siteId } = useEditor();
  const [sitePages, setSitePages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [styleState, setStyleState] = useState("Normal"); // "Normal" or "Hover"

  const device = editor.editor.device || "Desktop";
  const selectedElement = editor.editor.selectedElement;

  const getStyleObject = () => {
    if (!selectedElement.styles) return {};
    if (styleState === "Hover") {
      return selectedElement.styles._hover?.[device] || {};
    }
    return selectedElement.styles[device] || {};
  };

  const activeStyles = getStyleObject();

  const parseTransform = (transform = "") => {
    const read = (regex, fallback = "") => {
      const match = transform.match(regex);
      return match ? match[1] : fallback;
    };
    return {
      translateX: read(/translateX\(([^)]+)\)/),
      translateY: read(/translateY\(([^)]+)\)/),
      scale: read(/scale\(([^)]+)\)/, "1"),
      rotate: read(/rotate\(([^)]+)\)/, "0deg"),
      skewX: read(/skewX\(([^)]+)\)/, "0deg"),
      skewY: read(/skewY\(([^)]+)\)/, "0deg"),
    };
  };

  const transformState = parseTransform(activeStyles.transform || "");

  const handleTransformChange = (part, value) => {
    const next = { ...transformState, [part]: value };
    const transformString = [
      next.translateX ? `translateX(${next.translateX})` : "",
      next.translateY ? `translateY(${next.translateY})` : "",
      next.scale ? `scale(${next.scale})` : "",
      next.rotate ? `rotate(${next.rotate})` : "",
      next.skewX ? `skewX(${next.skewX})` : "",
      next.skewY ? `skewY(${next.skewY})` : "",
    ]
      .filter(Boolean)
      .join(" ");
    handleStyleChange("transform", transformString);
  };

  const handleStyleChange = (styleProperty, value) => {
    const newStyles = { ...selectedElement.styles };

    if (styleState === "Hover") {
      if (!newStyles._hover) newStyles._hover = {};
      if (!newStyles._hover[device]) newStyles._hover[device] = {};
      newStyles._hover[device][styleProperty] = value;
    } else {
      if (!newStyles[device]) newStyles[device] = {};
      newStyles[device][styleProperty] = value;
    }

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...selectedElement,
          styles: newStyles,
        },
      },
    });
  };

  const handleBulkStyleChange = (e) => {
    handleStyleChange(e.target.id, e.target.value);
  };
  
  const handleContentChange = (e) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...selectedElement,
          content: { ...selectedElement.content, [e.target.id]: e.target.value },
        },
      },
    });
  };

  useEffect(() => {
    const shouldLoadPages = selectedElement?.type === "link" && siteId;
    if (!shouldLoadPages) {
      setSitePages([]);
      return;
    }

    const loadPages = async () => {
      setPagesLoading(true);
      try {
        const pages = await getSitePages(siteId);
        setSitePages(pages || []);
      } catch {
        setSitePages([]);
      } finally {
        setPagesLoading(false);
      }
    };
    loadPages();
  }, [selectedElement?.id, siteId]);
  
  // No element selected
  if (!selectedElement.id) {
    return (
      <div className="flex flex-col h-full bg-black text-white">
        <div className="px-4 py-3 border-b border-[#222222] bg-[#0a0a0a]">
          <h2 className="text-sm font-bold">Styles</h2>
          <p className="text-[#aaaaaa] text-xs mt-1">Select an element to begin styling.</p>
        </div>
        <div className="flex flex-col flex-grow items-center justify-center gap-3 text-[#666666]">
          <MousePointerClick className="w-8 h-8" />
          <p className="text-sm text-center max-w-[160px]">Click an element on the canvas to edit its properties.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#222222] bg-[#0a0a0a]">
        <p className="text-sm text-white font-bold truncate">{selectedElement.name}</p>
        <p className="text-xs text-[#aaaaaa]">Type: <span className="text-white">{selectedElement.type}</span></p>
      </div>

      {/* State Toggle */}
      <div className="p-2 border-b border-[#222222]">
          <div className="flex bg-[#111111] p-1 rounded-md">
              <button 
                  onClick={() => setStyleState('Normal')}
                  className={`flex-1 text-center text-xs py-1.5 rounded-sm transition-colors ${styleState === 'Normal' ? 'bg-white text-black' : 'text-[#aaaaaa] hover:bg-[#222222]'}`}
              >
                  Normal
              </button>
              <button 
                  onClick={() => setStyleState('Hover')}
                  className={`flex-1 text-center text-xs py-1.5 rounded-sm transition-colors ${styleState === 'Hover' ? 'bg-white text-black' : 'text-[#aaaaaa] hover:bg-[#222222]'}`}
              >
                  :hover
              </button>
          </div>
      </div>
      
      {/* Settings Sections */}
      <div className="flex-grow overflow-y-auto">
        {(selectedElement.type === "link" || selectedElement.type === "video" || selectedElement.type === "image") && (
          <Section title="Content">
            {selectedElement.type === "link" && (
              <div className="flex flex-col gap-2">
                <Label>Link Path (URL or /slug)</Label>
                <Input id="href" placeholder="https://..." onChange={handleContentChange} value={selectedElement.content.href} />
                <Label>Site Pages</Label>
                <div className="flex flex-wrap gap-1.5">
                  {sitePages.map(p => (
                    <button key={p.id} onClick={() => handleContentChange({ target: { id: 'href', value: p.slug === 'home' ? '/' : `/${p.slug}`}})} className="px-2 py-0.5 text-xs rounded border border-[#333333] bg-[#111111] hover:border-white transition-colors">{p.name}</button>
                  ))}
                </div>
              </div>
            )}
            {selectedElement.type === "video" && (
                <div className="flex flex-col gap-2"><Label>Video URL</Label><Input id="src" placeholder="https://youtube.com/embed/..." onChange={handleContentChange} value={selectedElement.content.src} /></div>
            )}
            {selectedElement.type === "image" && (
                <>
                <div className="flex flex-col gap-2"><Label>Image URL</Label><Input id="src" placeholder="https://..." onChange={handleContentChange} value={selectedElement.content.src} /></div>
                <div className="flex flex-col gap-2"><Label>Alt Text</Label><Input id="alt" placeholder="Image description" onChange={handleContentChange} value={selectedElement.content.alt} /></div>
                </>
            )}
          </Section>
        )}

        <Section title="Layout & Position">
          <ToggleBtnGroup title="Display" onChange={(v) => handleStyleChange('display', v)} value={activeStyles.display} options={[ { value: 'block', icon: <div className="w-4 h-4 border-2 border-current" />, title: 'Block'}, { value: 'flex', icon: <div className="w-4 h-4 border-2 border-current flex gap-0.5 p-0.5"><div className="w-1/2 h-full bg-current" /><div className="w-1/2 h-full bg-current" /></div>, title: 'Flex'}, { value: 'grid', icon: <div className="w-4 h-4 border-2 border-current grid grid-cols-2 gap-0.5 p-0.5"><div className="bg-current"/><div className="bg-current"/><div className="bg-current"/><div className="bg-current"/></div>, title: 'Grid'}, { value: 'none', icon: <EyeOff className="w-4 h-4" />, title: 'None'}]}/>
          {activeStyles.display === 'flex' && (
            <div className="p-3 rounded bg-[#0a0a0a] border border-[#222222] flex flex-col gap-3">
              <SelectInput label="Direction" options={[{value: 'row', label: 'Row'}, {value: 'column', label: 'Column'}]} value={activeStyles.flexDirection} onChange={(v) => handleStyleChange('flexDirection', v)} />
              <ToggleBtnGroup title="Justify" onChange={(v) => handleStyleChange('justifyContent', v)} value={activeStyles.justifyContent} options={[{value: 'flex-start', icon: <AlignHorizontalJustifyStart className="w-4 h-4" />, title: 'Start'}, {value: 'center', icon: <AlignHorizontalJustifyCenterIcon className="w-4 h-4" />, title: 'Center'}, {value: 'flex-end', icon: <AlignHorizontalJustifyEnd className="w-4 h-4" />, title: 'End'}, {value: 'space-between', icon: <AlignHorizontalSpaceBetween className="w-4 h-4" />, title: 'Space Between'}]} />
              <ToggleBtnGroup title="Align" onChange={(v) => handleStyleChange('alignItems', v)} value={activeStyles.alignItems} options={[{value: 'flex-start', icon: <AlignVerticalJustifyStart className="w-4 h-4" />, title: 'Start'}, {value: 'center', icon: <AlignVerticalJustifyCenter className="w-4 h-4" />, title: 'Center'}, {value: 'flex-end', icon: <AlignVerticalJustifyEnd className="w-4 h-4" />, title: 'End'}]} />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>Position</Label>
            <SelectInput options={[{value: 'static', label: 'Static'}, {value: 'relative', label: 'Relative'}, {value: 'absolute', label: 'Absolute'}, {value: 'fixed', label: 'Fixed'}, {value: 'sticky', label: 'Sticky'}]} value={activeStyles.position} onChange={(v) => handleStyleChange('position', v)} />
          </div>
          {['absolute', 'fixed', 'sticky'].includes(activeStyles.position) && (
             <FourWayInput label="" values={activeStyles} onChange={handleBulkStyleChange} />
          )}
          <div className="flex flex-col gap-2"><Label>Z-Index</Label><Input id="zIndex" value={activeStyles.zIndex} onChange={handleBulkStyleChange} /></div>
          <div className="flex flex-col gap-2"><Label>Overflow</Label><SelectInput options={[{value: 'visible', label: 'Visible'}, {value: 'hidden', label: 'Hidden'}, {value: 'scroll', label: 'Scroll'}, {value: 'auto', label: 'Auto'}]} value={activeStyles.overflow} onChange={(v) => handleStyleChange('overflow', v)} /></div>
        </Section>
        
        <Section title="Sizing & Spacing">
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1"><Label>Width</Label><Input id="width" value={activeStyles.width} onChange={handleBulkStyleChange} /></div>
                <div className="flex flex-col gap-1"><Label>Height</Label><Input id="height" value={activeStyles.height} onChange={handleBulkStyleChange} /></div>
                <div className="flex flex-col gap-1"><Label>Min W</Label><Input id="minWidth" value={activeStyles.minWidth} onChange={handleBulkStyleChange} /></div>
                <div className="flex flex-col gap-1"><Label>Min H</Label><Input id="minHeight" value={activeStyles.minHeight} onChange={handleBulkStyleChange} /></div>
            </div>
            <FourWayInput label="padding" values={activeStyles} onChange={handleBulkStyleChange} />
            <FourWayInput label="margin" values={activeStyles} onChange={handleBulkStyleChange} />
        </Section>
        
        <Section title="Typography">
          <div className="flex flex-col gap-2"><Label>Font Family</Label><SelectInput options={GOOGLE_FONTS.map(f => ({value: f, label: f}))} placeholder="Select Font" value={activeStyles.fontFamily} onChange={(v) => handleStyleChange('fontFamily', v)}/></div>
          <ColorInput label="Color" value={activeStyles.color} onChange={(v) => handleStyleChange("color", v)} />
          <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1"><Label>Size</Label><Input id="fontSize" value={activeStyles.fontSize} onChange={handleBulkStyleChange} placeholder="16px"/></div>
              <div className="flex flex-col gap-1"><Label>Weight</Label><Input id="fontWeight" value={activeStyles.fontWeight} onChange={handleBulkStyleChange} placeholder="400" /></div>
          </div>
          <ToggleBtnGroup title="Align" onChange={(v) => handleStyleChange('textAlign', v)} value={activeStyles.textAlign} options={[{ value: "left", icon: <AlignLeft className="w-4 h-4" />, title: "Left" }, { value: "center", icon: <AlignCenter className="w-4 h-4" />, title: "Center" }, { value: "right", icon: <AlignRight className="w-4 h-4" />, title: "Right" }]}/>
        </Section>

        <Section title="Decorations">
            <div className="flex flex-col gap-2">
              <Label>Opacity</Label>
              <SliderInput min={0} max={1} step={0.01} value={activeStyles.opacity} onChange={(v) => handleStyleChange('opacity', v)} />
            </div>
            <ColorInput label="Background" value={activeStyles.background} onChange={(v) => handleStyleChange("background", v)} />
            {/* Simple Gradient Builder */}
            <div className="p-3 rounded bg-[#0a0a0a] border border-[#222222] flex flex-col gap-3">
              <Label className="text-center">Simple Linear Gradient</Label>
              <Input id="gradient-angle" placeholder="Angle (e.g. 90deg)" onChange={(e) => handleStyleChange('background', `linear-gradient(${e.target.value}, ${activeStyles.background?.split(',')[1] || '#000'}, ${activeStyles.background?.split(',')[2] || '#fff'})`)} />
              <Input id="gradient-from" placeholder="From Color (#...)" onChange={(e) => handleStyleChange('background', `linear-gradient(${activeStyles.background?.split('(')[1]?.split(',')[0] || '90deg'}, ${e.target.value}, ${activeStyles.background?.split(',')[2] || '#fff'})`)} />
              <Input id="gradient-to" placeholder="To Color (#...)" onChange={(e) => handleStyleChange('background', `linear-gradient(${activeStyles.background?.split('(')[1]?.split(',')[0] || '90deg'}, ${activeStyles.background?.split(',')[1] || '#000'}, ${e.target.value})`)} />
            </div>
            <div className="flex flex-col gap-2"><Label>Border Radius</Label><Input id="borderRadius" value={activeStyles.borderRadius} onChange={handleBulkStyleChange} placeholder="0px"/></div>
            <div className="flex flex-col gap-2"><Label>Border</Label><Input id="border" value={activeStyles.border} onChange={handleBulkStyleChange} placeholder="1px solid #222222"/></div>
            <div className="flex flex-col gap-2"><Label>Box Shadow</Label><BoxShadowBuilder value={activeStyles.boxShadow} onChange={(v) => handleStyleChange('boxShadow', v)} /></div>
        </Section>

        <Section title="Transforms">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1"><Label>Translate X</Label><Input value={transformState.translateX} placeholder="0px" onChange={(e) => handleTransformChange("translateX", e.target.value)} /></div>
            <div className="flex flex-col gap-1"><Label>Translate Y</Label><Input value={transformState.translateY} placeholder="0px" onChange={(e) => handleTransformChange("translateY", e.target.value)} /></div>
            <div className="flex flex-col gap-1"><Label>Scale</Label><Input value={transformState.scale} placeholder="1" onChange={(e) => handleTransformChange("scale", e.target.value)} /></div>
            <div className="flex flex-col gap-1"><Label>Rotate</Label><Input value={transformState.rotate} placeholder="0deg" onChange={(e) => handleTransformChange("rotate", e.target.value)} /></div>
            <div className="flex flex-col gap-1"><Label>Skew X</Label><Input value={transformState.skewX} placeholder="0deg" onChange={(e) => handleTransformChange("skewX", e.target.value)} /></div>
            <div className="flex flex-col gap-1"><Label>Skew Y</Label><Input value={transformState.skewY} placeholder="0deg" onChange={(e) => handleTransformChange("skewY", e.target.value)} /></div>
          </div>
        </Section>

        <Section title="Transitions">
          <div className="flex flex-col gap-2"><Label>Property</Label><Input id="transitionProperty" value={activeStyles.transitionProperty} onChange={handleBulkStyleChange} placeholder="all"/></div>
          <div className="flex flex-col gap-2"><Label>Duration</Label><Input id="transitionDuration" value={activeStyles.transitionDuration} onChange={handleBulkStyleChange} placeholder="0.3s"/></div>
          <div className="flex flex-col gap-2"><Label>Timing Function</Label><Input id="transitionTimingFunction" value={activeStyles.transitionTimingFunction} onChange={handleBulkStyleChange} placeholder="ease-in-out"/></div>
          <div className="flex flex-col gap-2"><Label>Delay</Label><Input id="transitionDelay" value={activeStyles.transitionDelay} onChange={handleBulkStyleChange} placeholder="0s"/></div>
        </Section>

        <Section title="Animations (WIP)">
           <div className="flex flex-col gap-2"><Label>Scroll Animation</Label><SelectInput value={selectedElement.content?.scrollAnimation || "none"} onChange={(v) => handleContentChange({ target: { id: "scrollAnimation", value: v } })} options={[{value: 'none', label: 'None'},{value: 'fadeIn', label: 'Fade In'}, {value: 'slideInLeft', label: 'Slide In Left'}, {value: 'slideInRight', label: 'Slide In Right'}]} /></div>
           <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1"><Label>Duration (s)</Label><Input id="animationDuration" value={selectedElement.content?.animationDuration} placeholder="0.6" onChange={handleContentChange} /></div>
            <div className="flex flex-col gap-1"><Label>Delay (s)</Label><Input id="animationDelay" value={selectedElement.content?.animationDelay} placeholder="0" onChange={handleContentChange} /></div>
           </div>
        </Section>
        
        <Section title="Custom CSS">
            <div className="flex flex-col gap-2">
                <Label>Add your own CSS</Label>
                <textarea 
                    placeholder="selector { color: white; }"
                    value={selectedElement.content?.customCss || ""}
                    onChange={(e) => handleContentChange({ target: { id: "customCss", value: e.target.value } })}
                    className="w-full h-32 p-2.5 text-sm font-mono rounded bg-black border border-[#222222] text-white placeholder:text-[#666666] outline-none focus:border-white transition-all resize-none"
                />
            </div>
        </Section>
      </div>
    </div>
  );
};

export default SettingsTab;