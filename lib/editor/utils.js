/**
 * Handle keyboard formatting shortcuts for the editor.
 * Supports:
 * - Ctrl/Cmd + U → toggle underline
 * - Ctrl/Cmd + I → toggle italic
 * - Ctrl/Cmd + B → toggle bold
 * - Ctrl/Cmd + E → toggle center/left text alignment
 */
export const formatTextOnKeyboard = (keyboardEvent, editor, dispatch) => {
  const device = editor.device || "Desktop";
  if (
    keyboardEvent.key === "u" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    const nextStyles = ensureDeviceStyles(editor.selectedElement.styles);
    const currentDeviceStyles = nextStyles[device] || {};

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...nextStyles,
            [device]: {
              ...currentDeviceStyles,
              textDecoration:
                currentDeviceStyles.textDecoration === "underline"
                ? "none"
                : "underline",
            },
          },
        },
      },
    });
  } else if (
    keyboardEvent.key === "i" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    const nextStyles = ensureDeviceStyles(editor.selectedElement.styles);
    const currentDeviceStyles = nextStyles[device] || {};

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...nextStyles,
            [device]: {
              ...currentDeviceStyles,
              fontStyle:
                currentDeviceStyles.fontStyle === "italic"
                ? "normal"
                : "italic",
            },
          },
        },
      },
    });
  } else if (
    keyboardEvent.key === "b" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    const nextStyles = ensureDeviceStyles(editor.selectedElement.styles);
    const currentDeviceStyles = nextStyles[device] || {};

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...nextStyles,
            [device]: {
              ...currentDeviceStyles,
              fontWeight:
                currentDeviceStyles.fontWeight === "700"
                ? "normal"
                : "700",
            },
          },
        },
      },
    });
  } else if (
    keyboardEvent.key === "e" &&
    (keyboardEvent.ctrlKey || keyboardEvent.metaKey)
  ) {
    keyboardEvent.preventDefault();
    const nextStyles = ensureDeviceStyles(editor.selectedElement.styles);
    const currentDeviceStyles = nextStyles[device] || {};

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...editor.selectedElement,
          styles: {
            ...nextStyles,
            [device]: {
              ...currentDeviceStyles,
              textAlign:
                currentDeviceStyles.textAlign === "center"
                ? "left"
                : "center",
            },
          },
        },
      },
    });
  }
};

export const resolveDeviceStyles = (styles, device) => {
  if (!styles) return {};
  const hasDeviceStyles =
    styles.Desktop || styles.Tablet || styles.Mobile;
  if (!hasDeviceStyles) return styles;

  if (device === "Desktop" || !device) {
    return styles.Desktop || {};
  }

  const target = styles[device];
  if (target && Object.keys(target).length > 0) return target;

  return styles.Desktop || {};
};

export const resolveElementStateStyles = (styles, device, isHoverActive = false) => {
  const baseStyles = resolveDeviceStyles(styles, device);
  if (!isHoverActive) return baseStyles;
  const hoverStyles = styles?._hover?.[device] || styles?._hover?.Desktop || {};
  return {
    ...baseStyles,
    ...hoverStyles,
  };
};

export const ensureDeviceStyles = (styles) => {
  if (styles?.Desktop || styles?.Tablet || styles?.Mobile) {
    return styles;
  }
  const base = styles || {};
  return {
    Desktop: { ...base },
    Tablet: { ...base },
    Mobile: { ...base },
  };
};
