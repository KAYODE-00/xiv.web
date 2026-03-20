"use client";

export const getScopedCss = (elementId, customCss) => {
  if (!elementId || !customCss || typeof customCss !== "string") return "";
  const trimmed = customCss.trim();
  if (!trimmed) return "";

  // Allow users to reference "&" as the current element selector.
  const withAmpersand = trimmed.replaceAll("&", `[data-xiv-id="${elementId}"]`);
  if (withAmpersand !== trimmed) return withAmpersand;

  // If user provided plain declarations, scope them automatically.
  if (!trimmed.includes("{") && trimmed.includes(":")) {
    return `[data-xiv-id="${elementId}"] { ${trimmed} }`;
  }

  // If user provided rules, prefix each top-level selector block.
  return trimmed.replace(/(^|})\s*([^{@}][^{]+)\s*\{/g, (_match, close, selector) => {
    const scopedSelector = selector
      .split(",")
      .map((s) => `[data-xiv-id="${elementId}"] ${s.trim()}`)
      .join(", ");
    return `${close} ${scopedSelector} {`;
  });
};
