"use client";

import React from "react";
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  Expand,
  GripHorizontal,
  Italic,
  LucideImageDown,
  MousePointerClick,
  RemoveFormatting,
  Shrink,
  Type,
  Underline,
  Waves,
} from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import { getSitePages } from "@/lib/actions/pages";
import { ensureDeviceStyles, resolveDeviceStyles } from "@/lib/editor/utils";

// Simple reusable components replacing shadcn
const Label = ({ children, className = "" }) => (
  <label className={`text-[11px] font-medium text-[#8888aa] ${className}`}>
    {children}
  </label>
);

const Input = ({ id, placeholder, onChange, value, defaultValue, className = "" }) => (
  <input
    id={id}
    placeholder={placeholder}
    onChange={onChange}
    value={value || ""}
    defaultValue={defaultValue}
    className={`w-full px-3 py-1.5 text-sm rounded-md bg-[#111118] border border-[#1e1e2e] text-[#f0f0f8] placeholder:text-[#666689] outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/30 transition-all ${className}`}
  />
);

const Section = ({ title, children }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="border-b border-[#1e1e2e]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between
        px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]
        text-[#8888aa] hover:text-[#f0f0f8]
        hover:bg-[#111118] transition-colors"
      >
        {title}
        <span className="text-[#666689]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

const ToggleBtn = ({ value, current, onChange, title, children }) => (
  <button
    title={title}
    onClick={() => onChange(value)}
    className={`w-9 h-8 flex items-center justify-center
    rounded-full transition-all border
    ${current === value
      ? "bg-[#6c63ff] border-[#6c63ff] text-white shadow-[0_0_0_2px_rgba(108,99,255,0.2)]"
      : "border-[#1e1e2e] text-[#8888aa] hover:text-[#f0f0f8] hover:border-[#6c63ff] hover:bg-[#111118]"
    }`}
  >
    {children}
  </button>
);

const SelectInput = ({ value, onChange, options, placeholder }) => (
  <select
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-1.5 text-sm rounded-md
    bg-[#111118] border border-[#1e1e2e] text-[#f0f0f8]
    outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/30
    transition-all"
  >
    <option value="" disabled>{placeholder}</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const SliderInput = ({ value, onChange, max = 100, unit = "%" }) => {
  const numValue = typeof value === "number"
    ? value
    : parseFloat((value || "100").replace(unit, "")) || 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-end">
        <span className="text-[11px] text-[#8888aa]">{numValue}{unit}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={numValue}
        onChange={(e) => onChange(`${e.target.value}${unit}`)}
        className="w-full accent-[#6c63ff]"
      />
    </div>
  );
};

const ColorInput = ({ value, onChange, label }) => {
  const isHex =
    typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
  const safeValue = isHex ? value : "#000000";

  return (
    <div className="flex flex-col gap-1">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-[#1e1e2e] bg-[#111118]"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-1.5 text-sm rounded-md
          bg-[#111118] border border-[#1e1e2e] text-[#f0f0f8]
          outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/30"
        />
      </div>
    </div>
  );
};

// ============================================================
// MAIN SETTINGS TAB
// ============================================================
const SettingsTab = () => {
  const { editor, dispatch, siteId } = useEditor();
  const [sitePages, setSitePages] = React.useState([]);
  const [pagesLoading, setPagesLoading] = React.useState(false);
  const device = editor.editor.device || "Desktop";

  const handleChangeCustomValues = (e) => {
    const settingProperty = e.target.id;
    const value = e.target.value;

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.editor.selectedElement,
          content: {
            ...editor.editor.selectedElement.content,
            [settingProperty]: value,
          },
        },
      },
    });
  };

  const handleOnChanges = (e) => {
    const styleSettings = e.target.id;
    const value = e.target.value;
    const nextStyles = ensureDeviceStyles(
      editor.editor.selectedElement.styles
    );
    const currentDeviceStyles = nextStyles[device] || {};

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.editor.selectedElement,
          styles: {
            ...nextStyles,
            [device]: {
              ...currentDeviceStyles,
              [styleSettings]: value,
            },
          },
        },
      },
    });
  };

  const handleToggleChange = (id, value) => {
    handleOnChanges({ target: { id, value } });
  };

  React.useEffect(() => {
    let isActive = true;
    const shouldLoadPages =
      editor.editor.selectedElement?.type === "link" &&
      !Array.isArray(editor.editor.selectedElement?.content) &&
      siteId;
    if (!shouldLoadPages) {
      setSitePages([]);
      return undefined;
    }

    const loadPages = async () => {
      setPagesLoading(true);
      try {
        const pages = await getSitePages(siteId);
        if (isActive) setSitePages(pages || []);
      } catch {
        if (isActive) setSitePages([]);
      } finally {
        if (isActive) setPagesLoading(false);
      }
    };

    loadPages();
    return () => {
      isActive = false;
    };
  }, [
    editor.editor.selectedElement?.type,
    editor.editor.selectedElement?.content,
    siteId,
  ]);

  // No element selected
  if (!editor.editor.selectedElement.id) {
    return (
      <div className="flex flex-col text-[#f0f0f8]">
        <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8888aa]">
            Styles
          </div>
          <p className="text-[#8888aa] text-xs mt-1">
            Click any element to customize it
          </p>
        </div>
        <div className="flex flex-col items-center justify-center
          gap-3 py-24 text-[#666689]">
          <MousePointerClick className="w-8 h-8" />
          <p className="text-sm text-center max-w-[160px]">
            Pick a component to customize
          </p>
        </div>
      </div>
    );
  }

  const el = editor.editor.selectedElement;
  const activeStyles = resolveDeviceStyles(el.styles, device);

  return (
    <div className="flex flex-col text-[#f0f0f8]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#8888aa]">
          Styles
        </div>
        <p className="text-[#8888aa] text-xs mt-1">
          Editing: <span className="text-[#6c63ff]">{el.name}</span>
        </p>
        <p className="text-[#8888aa] text-xs mt-1">
          Device: <span className="text-[#6c63ff]">{device}</span>
        </p>
      </div>

      {/* CUSTOM SECTION */}
      {(el.type === "link" ||
        el.type === "video" ||
        el.type === "contactForm" ||
        el.type === "image") &&
        !Array.isArray(el.content) && (
          <Section title="Custom">
            {el.type === "link" && (
              <div className="flex flex-col gap-1">
                <Label>Link Path</Label>
                <Input
                  id="href"
                  placeholder="https://example.com"
                  onChange={handleChangeCustomValues}
                  value={el.content.href}
                />
                <div className="pt-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8888aa]">
                    Pages on this site:
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pagesLoading && (
                      <span className="text-xs text-[#8888aa]">
                        Loading pages...
                      </span>
                    )}
                    {!pagesLoading && sitePages.length === 0 && (
                      <span className="text-xs text-[#8888aa]">
                        No pages found
                      </span>
                    )}
                    {!pagesLoading &&
                      sitePages.map((page) => {
                        const isHome =
                          page.slug === "home" || page.slug === "/";
                        const href = isHome ? "/" : `/${page.slug}`;
                        return (
                          <button
                            key={page.id}
                            type="button"
                            onClick={() =>
                              handleToggleChange("href", href)
                            }
                            className="px-2.5 py-1 rounded-full text-xs
                            bg-[#6c63ff]/20 text-[#cfcdf8]
                            border border-[#6c63ff]/40
                            hover:bg-[#6c63ff]/30 transition-colors"
                          >
                            {page.name}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
            {el.type === "video" && (
              <div className="flex flex-col gap-1">
                <Label>Video URL</Label>
                <Input
                  id="src"
                  placeholder="https://youtube.com/embed/..."
                  onChange={handleChangeCustomValues}
                  value={el.content.src}
                />
              </div>
            )}
            {el.type === "contactForm" && (
              <>
                <div className="flex flex-col gap-1">
                  <Label>Form Title</Label>
                  <Input
                    id="formTitle"
                    placeholder="Want a free quote?"
                    onChange={handleChangeCustomValues}
                    value={el.content.formTitle}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Form Description</Label>
                  <Input
                    id="formDescription"
                    placeholder="Get in touch"
                    onChange={handleChangeCustomValues}
                    value={el.content.formDescription}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Button Text</Label>
                  <Input
                    id="formButton"
                    placeholder="Submit"
                    onChange={handleChangeCustomValues}
                    value={el.content.formButton}
                  />
                </div>
              </>
            )}
            {el.type === "image" && (
              <>
                <div className="flex flex-col gap-1">
                  <Label>Image URL</Label>
                  <Input
                    id="src"
                    placeholder="https://example.com/image.jpg"
                    onChange={handleChangeCustomValues}
                    value={el.content.src}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Alt Description</Label>
                  <Input
                    id="alt"
                    placeholder="Image description"
                    onChange={handleChangeCustomValues}
                    value={el.content.alt}
                  />
                </div>
              </>
            )}
          </Section>
        )}

      {/* TYPOGRAPHY */}
      <Section title="Typography">
        <div className="flex flex-col gap-1">
          <Label>Text Align</Label>
          <div className="flex gap-1">
            {[
              { value: "left", icon: <AlignLeft className="w-4 h-4" />, title: "Left" },
              { value: "center", icon: <AlignCenter className="w-4 h-4" />, title: "Center" },
              { value: "right", icon: <AlignRight className="w-4 h-4" />, title: "Right" },
            ].map((btn) => (
              <ToggleBtn
                key={btn.value}
                value={btn.value}
                current={activeStyles.textAlign}
                onChange={(v) => handleToggleChange("textAlign", v)}
                title={btn.title}
              >
                {btn.icon}
              </ToggleBtn>
            ))}
          </div>
        </div>

        <ColorInput
          label="Text Color"
          value={activeStyles.color}
          onChange={(v) => handleToggleChange("color", v)}
        />

        <div className="flex flex-col gap-1">
          <Label>Text Decoration</Label>
          <div className="flex gap-1">
            {[
              { value: "underline", icon: <Underline className="w-4 h-4" />, title: "Underline" },
              { value: "underline dotted", icon: <GripHorizontal className="w-4 h-4" />, title: "Dotted" },
              { value: "underline wavy", icon: <Waves className="w-4 h-4" />, title: "Wavy" },
            ].map((btn) => (
              <ToggleBtn
                key={btn.value}
                value={btn.value}
                current={activeStyles.textDecoration}
                onChange={(v) => handleToggleChange("textDecoration", v)}
                title={btn.title}
              >
                {btn.icon}
              </ToggleBtn>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Font Style</Label>
          <div className="flex gap-1">
            {[
              { value: "italic", icon: <Italic className="w-4 h-4" />, title: "Italic" },
              { value: "normal", icon: <Type className="w-4 h-4" />, title: "Normal" },
              { value: "oblique", icon: <RemoveFormatting className="w-4 h-4" />, title: "Oblique" },
            ].map((btn) => (
              <ToggleBtn
                key={btn.value}
                value={btn.value}
                current={activeStyles.fontStyle}
                onChange={(v) => handleToggleChange("fontStyle", v)}
                title={btn.title}
              >
                {btn.icon}
              </ToggleBtn>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Font Weight</Label>
          <SelectInput
            value={activeStyles.fontWeight?.toString()}
            onChange={(v) => handleToggleChange("fontWeight", v)}
            placeholder="Select weight"
            options={[
              { value: "700", label: "Bold" },
              { value: "600", label: "Semi-bold" },
              { value: "500", label: "Medium" },
              { value: "normal", label: "Regular" },
              { value: "300", label: "Light" },
              { value: "200", label: "Extra-light" },
            ]}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <Label>Font Size</Label>
            <Input
              id="fontSize"
              placeholder="16px"
              onChange={handleOnChanges}
              value={activeStyles.fontSize}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Label>Line Height</Label>
            <Input
              id="lineHeight"
              placeholder="1.5rem"
              onChange={handleOnChanges}
              value={activeStyles.lineHeight}
            />
          </div>
        </div>
      </Section>

      {/* DECORATIONS */}
      <Section title="Decorations">
        <div className="flex flex-col gap-1">
          <Label>Opacity</Label>
          <SliderInput
            value={activeStyles?.opacity}
            onChange={(v) => handleToggleChange("opacity", v)}
            unit="%"
          />
        </div>

        <ColorInput
          label="Border Color"
          value={activeStyles.borderColor}
          onChange={(v) => handleToggleChange("borderColor", v)}
        />

        <div className="flex flex-col gap-1">
          <Label>Border Width</Label>
          <SliderInput
            value={activeStyles?.borderWidth}
            onChange={(v) => handleToggleChange("borderWidth", v)}
            unit="px"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Border Radius</Label>
          <SliderInput
            value={activeStyles?.borderRadius}
            onChange={(v) => handleToggleChange("borderRadius", v)}
            unit="px"
          />
        </div>

        <ColorInput
          label="Background Color"
          value={activeStyles.backgroundColor || activeStyles.background}
          onChange={(v) => handleToggleChange("backgroundColor", v)}
        />

        <div className="flex flex-col gap-1">
          <Label>Background Image</Label>
          <Input
            id="backgroundImage"
            placeholder="url(https://...)"
            onChange={handleOnChanges}
            value={activeStyles.backgroundImage}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Background Size</Label>
          <div className="flex gap-1">
            {[
              { value: "cover", icon: <Expand className="w-4 h-4" />, title: "Cover" },
              { value: "contain", icon: <Shrink className="w-4 h-4" />, title: "Contain" },
              { value: "auto", icon: <LucideImageDown className="w-4 h-4" />, title: "Auto" },
            ].map((btn) => (
              <ToggleBtn
                key={btn.value}
                value={btn.value}
                current={activeStyles.backgroundSize?.toString()}
                onChange={(v) => handleToggleChange("backgroundSize", v)}
                title={btn.title}
              >
                {btn.icon}
              </ToggleBtn>
            ))}
          </div>
        </div>
      </Section>

      {/* LAYOUT */}
      <Section title="Layout">
        <div className="flex flex-col gap-1">
          <Label>Display</Label>
          <SelectInput
            value={activeStyles.display}
            onChange={(v) => handleToggleChange("display", v)}
            placeholder="Select display"
            options={[
              { value: "flex", label: "Flex" },
              { value: "inline-flex", label: "Inline Flex" },
              { value: "inline", label: "Inline" },
              { value: "block", label: "Block" },
              { value: "inline-block", label: "Inline Block" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Justify Content</Label>
          <div className="flex gap-1 flex-wrap">
            {[
              { value: "space-between", icon: <AlignHorizontalSpaceBetween className="w-4 h-4" />, title: "Space Between" },
              { value: "space-around", icon: <AlignHorizontalSpaceAround className="w-4 h-4" />, title: "Space Around" },
              { value: "center", icon: <AlignHorizontalJustifyCenterIcon className="w-4 h-4" />, title: "Center" },
              { value: "flex-start", icon: <AlignHorizontalJustifyStart className="w-4 h-4" />, title: "Start" },
              { value: "flex-end", icon: <AlignHorizontalJustifyEnd className="w-4 h-4" />, title: "End" },
            ].map((btn) => (
              <ToggleBtn
                key={btn.value}
                value={btn.value}
                current={activeStyles.justifyContent}
                onChange={(v) => handleToggleChange("justifyContent", v)}
                title={btn.title}
              >
                {btn.icon}
              </ToggleBtn>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Align Items</Label>
          <div className="flex gap-1">
            {[
              { value: "center", icon: <AlignVerticalJustifyCenter className="w-4 h-4" />, title: "Center" },
              { value: "flex-start", icon: <AlignVerticalJustifyStart className="w-4 h-4" />, title: "Start" },
              { value: "flex-end", icon: <AlignVerticalJustifyEnd className="w-4 h-4" />, title: "End" },
            ].map((btn) => (
              <ToggleBtn
                key={btn.value}
                value={btn.value}
                current={activeStyles.alignItems}
                onChange={(v) => handleToggleChange("alignItems", v)}
                title={btn.title}
              >
                {btn.icon}
              </ToggleBtn>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Direction</Label>
          <SelectInput
            value={activeStyles.flexDirection}
            onChange={(v) => handleToggleChange("flexDirection", v)}
            placeholder="Select direction"
            options={[
              { value: "row", label: "Row" },
              { value: "column", label: "Column" },
              { value: "row-reverse", label: "Row Reverse" },
              { value: "column-reverse", label: "Column Reverse" },
            ]}
          />
        </div>
      </Section>

      {/* DIMENSIONS */}
      <Section title="Dimensions">
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <Label>Height</Label>
            <Input
              id="height"
              placeholder="px"
              onChange={handleOnChanges}
              value={activeStyles.height}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <Label>Width</Label>
            <Input
              id="width"
              placeholder="px"
              onChange={handleOnChanges}
              value={activeStyles.width}
            />
          </div>
        </div>

        <Label className="text-center w-full">Margin (px)</Label>
        <div className="grid grid-cols-2 gap-2">
          {["marginTop", "marginBottom", "marginLeft", "marginRight"].map((id) => (
            <div key={id} className="flex flex-col gap-1">
              <Label>{id.replace("margin", "")}</Label>
              <Input
                id={id}
                placeholder="px"
                onChange={handleOnChanges}
                value={activeStyles[id]}
              />
            </div>
          ))}
        </div>

        <Label className="text-center w-full">Padding (px)</Label>
        <div className="grid grid-cols-2 gap-2">
          {["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].map((id) => (
            <div key={id} className="flex flex-col gap-1">
              <Label>{id.replace("padding", "")}</Label>
              <Input
                id={id}
                placeholder="px"
                onChange={handleOnChanges}
                value={activeStyles[id]}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default SettingsTab;
