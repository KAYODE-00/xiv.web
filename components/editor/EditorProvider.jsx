"use client";

import React from "react";

const initialEditorState = {
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  pageId: "",
};

const initialHistoryState = {
  currentIndex: 0,
  history: [initialEditorState],
};

const initialState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

/** * RECURSIVE HELPERS 
 */
const addElement = (elements, action) => {
  return elements.map((element) => {
    if (element.id === action.payload.containerId && Array.isArray(element.content)) {
      return {
        ...element,
        content: [...element.content, action.payload.elementDetails],
      };
    } else if (element.content && Array.isArray(element.content)) {
      return {
        ...element,
        content: addElement(element.content, action),
      };
    }
    return element;
  });
};

const updateElement = (elements, action) => {
  return elements.map((element) => {
    if (element.id === action.payload.elementDetails.id) {
      return { ...element, ...action.payload.elementDetails };
    } else if (element.content && Array.isArray(element.content)) {
      return {
        ...element,
        content: updateElement(element.content, action),
      };
    }
    return element;
  });
};

// NEW: Helper to update nested styles deeply
const updateStyles = (elements, elementId, styles) => {
  return elements.map((element) => {
    if (element.id === elementId) {
      return {
        ...element,
        styles: { ...element.styles, ...styles },
      };
    } else if (element.content && Array.isArray(element.content)) {
      return {
        ...element,
        content: updateStyles(element.content, elementId, styles),
      };
    }
    return element;
  });
};

const deleteElement = (elements, action) => {
  return elements.reduce((acc, element) => {
    if (element.id === action.payload.elementDetails.id) return acc;
    if (Array.isArray(element.content)) {
      const nextContent = deleteElement(element.content, action);
      acc.push(nextContent === element.content ? element : { ...element, content: nextContent });
      return acc;
    }
    acc.push(element);
    return acc;
  }, []);
};

const cloneElementWithNewIds = (element) => {
  const next = {
    ...element,
    id: crypto.randomUUID(),
  };
  if (Array.isArray(element.content)) {
    next.content = element.content.map(cloneElementWithNewIds);
  } else if (element.content && typeof element.content === "object") {
    next.content = { ...element.content };
  }
  if (element.styles && typeof element.styles === "object") {
    next.styles = JSON.parse(JSON.stringify(element.styles));
  }
  return next;
};

const duplicateElement = (elements, targetId) => {
  let didDuplicate = false;
  const walk = (items) =>
    items.map((item) => {
      if (!Array.isArray(item.content)) return item;
      const nextContent = [];
      item.content.forEach((child) => {
        nextContent.push(child);
        if (child.id === targetId) {
          nextContent.push(cloneElementWithNewIds(child));
          didDuplicate = true;
        }
      });
      return {
        ...item,
        content: walk(nextContent),
      };
    });
  return { elements: walk(elements), didDuplicate };
};

const normalizeElements = (elements) =>
  elements.map((element) => {
    const next = { ...element };
    if (Array.isArray(next.content)) {
      next.content = normalizeElements(next.content);
    }
    return next;
  });

/**
 * REDUCER
 */
const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ELEMENT": {
      const updatedEditor = {
        ...state.editor,
        elements: addElement(state.editor.elements, action),
      };
      return updateStateWithHistory(state, updatedEditor);
    }

    case "UPDATE_ELEMENT": {
      const updatedElements = updateElement(state.editor.elements, action);
      const updatedEditor = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: state.editor.selectedElement.id === action.payload.elementDetails.id
          ? { ...state.editor.selectedElement, ...action.payload.elementDetails }
          : state.editor.selectedElement,
      };
      return updateStateWithHistory(state, updatedEditor);
    }

    // NEW ACTION: Specific for styling to prevent full object overrides
    case "UPDATE_STYLES": {
      const updatedElements = updateStyles(
        state.editor.elements,
        action.payload.elementId,
        action.payload.styles
      );
      
      const isSelected = state.editor.selectedElement.id === action.payload.elementId;
      
      const updatedEditor = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: isSelected 
          ? { ...state.editor.selectedElement, styles: { ...state.editor.selectedElement.styles, ...action.payload.styles } }
          : state.editor.selectedElement,
      };
      return updateStateWithHistory(state, updatedEditor);
    }

    case "DELETE_ELEMENT": {
      const updatedEditor = {
        ...state.editor,
        elements: deleteElement(state.editor.elements, action),
      };
      return updateStateWithHistory(state, updatedEditor);
    }

    case "DUPLICATE_ELEMENT": {
      const targetId = action.payload?.elementDetails?.id;
      if (!targetId) return state;
      const result = duplicateElement(state.editor.elements, targetId);
      if (!result.didDuplicate) return state;
      const updatedEditor = {
        ...state.editor,
        elements: result.elements,
      };
      return updateStateWithHistory(state, updatedEditor);
    }

    case "CHANGE_CLICKED_ELEMENT": {
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || initialEditorState.selectedElement,
        },
      };
    }

    case "CHANGE_DEVICE": {
      return {
        ...state,
        editor: { ...state.editor, device: action.payload.device },
      };
    }

    case "TOGGLE_PREVIEW_MODE":
      return { ...state, editor: { ...state.editor, previewMode: !state.editor.previewMode } };

    case "TOGGLE_LIVE_MODE": {
      if (typeof action.payload?.value === "boolean") {
        return {
          ...state,
          editor: { ...state.editor, liveMode: action.payload.value },
        };
      }
      return {
        ...state,
        editor: { ...state.editor, liveMode: !state.editor.liveMode },
      };
    }

    case "SET_PAGE_ID":
      return {
        ...state,
        editor: { ...state.editor, pageId: action.payload?.pageId || "" },
      };

    case "UNDO": {
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        return {
          ...state,
          editor: { ...state.history.history[prevIndex] },
          history: { ...state.history, currentIndex: prevIndex },
        };
      }
      return state;
    }

    case "REDO": {
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        return {
          ...state,
          editor: { ...state.history.history[nextIndex] },
          history: { ...state.history, currentIndex: nextIndex },
        };
      }
      return state;
    }

    case "LOAD_DATA":
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: normalizeElements(action.payload.elements || initialEditorState.elements),
          liveMode: !!action.payload.withLive,
        },
      };

    case "CLEAR_HISTORY":
      return {
        ...state,
        history: {
          currentIndex: 0,
          history: [{ ...state.editor }],
        },
      };

    default:
      return state;
  }
};

// Helper to keep the reducer clean
const updateStateWithHistory = (state, updatedEditor) => {
  const updatedHistory = [
    ...state.history.history.slice(0, state.history.currentIndex + 1),
    { ...updatedEditor },
  ];
  return {
    ...state,
    editor: updatedEditor,
    history: {
      ...state.history,
      history: updatedHistory,
      currentIndex: updatedHistory.length - 1,
    },
  };
};

export const EditorContext = React.createContext({
  state: initialState,
  dispatch: () => undefined,
  siteId: "",
  pageDetails: null,
});

const EditorProvider = ({ children, siteId, pageDetails }) => {
  const [state, dispatch] = React.useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch, siteId, pageDetails }}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;