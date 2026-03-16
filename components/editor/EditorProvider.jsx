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

const addElement = (elements, action) => {
  if (action.type !== "ADD_ELEMENT") {
    throw Error(
      "You sent the wrong action type to the Add Element editor state"
    );
  }

  return elements.map((element) => {
    if (
      element.id === action.payload.containerId &&
      Array.isArray(element.content)
    ) {
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
  if (action.type !== "UPDATE_ELEMENT") {
    throw Error(
      "You sent the wrong action type to the Update Element editor state"
    );
  }

  return elements.map((element) => {
    if (element.id === action.payload.elementDetails.id) {
      return {
        ...element,
        ...action.payload.elementDetails,
      };
    } else if (element.content && Array.isArray(element.content)) {
      return {
        ...element,
        content: updateElement(element.content, action),
      };
    }
    return element;
  });
};

const deleteElement = (elements, action) => {
  if (action.type !== "DELETE_ELEMENT") {
    throw Error(
      "You sent the wrong action type to the Delete Element editor state"
    );
  }

  return elements.reduce((acc, element) => {
    if (element.id === action.payload.elementDetails.id) {
      return acc;
    }

    if (Array.isArray(element.content)) {
      const nextContent = deleteElement(element.content, action);
      acc.push(
        nextContent === element.content
          ? element
          : { ...element, content: nextContent }
      );
      return acc;
    }

    acc.push(element);
    return acc;
  }, []);
};

const normalizeElements = (elements) =>
  elements.map((element) => {
    const next = { ...element };
    if (next.styles && next.styles.background && !next.styles.backgroundColor) {
      const { background, ...restStyles } = next.styles;
      next.styles = { ...restStyles, backgroundColor: background };
    }
    if (Array.isArray(next.content)) {
      next.content = normalizeElements(next.content);
    }
    return next;
  });

const editorReducer = (state = initialState, action) => {
  switch (action.type) {

    case "ADD_ELEMENT": {
      const updatedEditor = {
        ...state.editor,
        elements: addElement(state.editor.elements, action),
      };

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
    }

    case "UPDATE_ELEMENT": {
      const updatedElements = updateElement(state.editor.elements, action);
      const isUpdatedElementSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;

      const updatedEditor = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: isUpdatedElementSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
            },
      };

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
    }

    case "DELETE_ELEMENT": {
      const updatedElements = deleteElement(state.editor.elements, action);

      const updatedEditor = {
        ...state.editor,
        elements: updatedElements,
      };

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
    }

    case "CHANGE_CLICKED_ELEMENT": {
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
          },
        },
      };
    }

    case "CHANGE_DEVICE": {
      return {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };
    }

    case "TOGGLE_PREVIEW_MODE": {
      return {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };
    }

    case "TOGGLE_LIVE_MODE": {
      return {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload
            ? action.payload.value
            : !state.editor.liveMode,
        },
      };
    }

    case "CLEAR_HISTORY": {
      return {
        ...state,
        history: {
          ...state.history,
          history: [],
          currentIndex: 0,
        },
      };
    }

    case "REDO": {
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        return {
          ...state,
          editor: { ...state.history.history[nextIndex] },
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
      }
      return state;
    }

    case "UNDO": {
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        return {
          ...state,
          editor: { ...state.history.history[prevIndex] },
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };
      }
      return state;
    }

    case "LOAD_DATA": {
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: normalizeElements(
            action.payload.elements || initialEditorState.elements
          ),
          liveMode: !!action.payload.withLive,
        },
      };
    }

    case "SET_PAGE_ID": {
      return {
        ...state,
        editor: {
          ...state.editor,
          pageId: action.payload.pageId,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export const EditorContext = React.createContext({
  editor: initialState,
  dispatch: () => undefined,
  siteId: "",
  pageDetails: null,
});

const EditorProvider = ({ children, siteId, pageDetails }) => {
  const [editor, dispatch] = React.useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        editor,
        dispatch,
        siteId,
        pageDetails,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
