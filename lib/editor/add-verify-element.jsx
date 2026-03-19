import { v4 as uuidv4 } from "uuid";
import { defaultStyles } from "@/config/editor";

const buildDeviceStyles = (baseStyles) => ({
  Desktop: { ...baseStyles },
  Tablet: { ...baseStyles },
  Mobile: { ...baseStyles },
});

const createTextElement = (name, type, innerText, extraStyles = {}) => ({
  content: { innerText },
  id: uuidv4(),
  name,
  type,
  styles: buildDeviceStyles({
    color: "#ffffff",
    ...defaultStyles,
    ...extraStyles,
  }),
});

const createContainerElement = (name, type, extraStyles = {}, children = []) => ({
  content: children,
  id: uuidv4(),
  name,
  type,
  styles: buildDeviceStyles({
    ...defaultStyles,
    ...extraStyles,
  }),
});

export const addVerifyElement = (componentType, id, dispatch) => {
  switch (componentType) {
    case "text": {
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createTextElement("Text", "text", "Text Element"),
        },
      });
      break;
    }

    case "image": {
  dispatch({
    type: "ADD_ELEMENT",
    payload: {
      containerId: id,
      elementDetails: {
        content: {
          src: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
          alt: "Image description",
        },
        id: uuidv4(),
        name: "Image",
        type: "image",
        styles: buildDeviceStyles({
          color: "#ffffff",
          width: "1000px",
          height: "600px",
          aspectRatio: "1/1",
          marginLeft: "auto",
          marginRight: "auto",
          ...defaultStyles,
        }),
      },
    },
  });
  break;
}

case "section": {
  dispatch({
    type: "ADD_ELEMENT",
    payload: {
      containerId: id,
      elementDetails: createContainerElement(
        "Section",
        "section",
        {},
        [createContainerElement("Container", "container", { width: "100%" }, [])]
      ),
    },
  });
  break;
}

case "container": {
  dispatch({
    type: "ADD_ELEMENT",
    payload: {
      containerId: id,
      elementDetails: createContainerElement("Container", "container"),
    },
  });
  break;
}

case "link": {
  dispatch({
    type: "ADD_ELEMENT",
    payload: {
      containerId: id,
      elementDetails: {
        ...createTextElement("Link", "link", "Link Element", { textDecoration: "underline" }),
        content: {
          innerText: "Link Element",
          href: "#",
        },
      },
    },
  });
  break;
}

case "video": {
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: {
            content: {
              src: "https://www.youtube.com/embed/so1_VXaGqmM?si=2lBxVOuA57XMv0JX",
            },
            id: uuidv4(),
            name: "Video",
            styles: buildDeviceStyles({}),
            type: "video",
          },
        },
      });
      break;
    }

case "contactForm": {
  dispatch({
    type: "ADD_ELEMENT",
    payload: {
      containerId: id,
      elementDetails: {
        content: {
          formTitle: "Want a free quote? We can help you",
          formDescription: "Get in touch",
          formButton: "Submit",
        },
        id: uuidv4(),
        name: "Contact Form",
        styles: buildDeviceStyles({}),
        type: "contactForm",
      },
    },
  });
  break;
}

case "paymentForm": {
  dispatch({
    type: "ADD_ELEMENT",
    payload: {
      containerId: id,
      elementDetails: {
        content: [],
        id: uuidv4(),
        name: "Payment",
        styles: buildDeviceStyles({}),
        type: "paymentForm",
      },
    },
  });
  break;
}

case "2Col": {
  dispatch({
    type: "ADD_ELEMENT",
    payload: {
      containerId: id,
      elementDetails: createContainerElement(
        "Two Columns",
        "2Col",
        { display: "flex" },
        [
          createContainerElement("Container", "container", { width: "100%" }, []),
          createContainerElement("Container", "container", { width: "100%" }, []),
        ]
      ),
    },
  });
  break;
}

case "3Col": {
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement(
            "Three Columns",
            "3Col",
            { display: "flex" },
            [
              createContainerElement("Container", "container", { width: "100%" }, []),
              createContainerElement("Container", "container", { width: "100%" }, []),
              createContainerElement("Container", "container", { width: "100%" }, []),
            ]
          ),
        },
      });
      break;
    }

    case "heading":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createTextElement("Heading", "text", "Heading", {
            fontSize: "48px",
            fontWeight: "800",
            lineHeight: "1.2",
          }),
        },
      });
      break;

    case "button":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: {
            ...createTextElement("Button", "link", "Button", {
              display: "inline-block",
              paddingTop: "12px",
              paddingBottom: "12px",
              paddingLeft: "20px",
              paddingRight: "20px",
              border: "1px solid #222222",
              background: "#ffffff",
              color: "#000000",
              textDecoration: "none",
              fontWeight: "700",
            }),
            content: {
              innerText: "Button",
              href: "#",
            },
          },
        },
      });
      break;

    case "div":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Div Block", "container", {
            minHeight: "80px",
            border: "1px solid #222222",
          }),
        },
      });
      break;

    case "grid":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Grid", "container", {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
          }),
        },
      });
      break;

    case "navbar":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Navbar", "container", {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "12px",
            paddingBottom: "12px",
            borderBottom: "1px solid #222222",
          }),
        },
      });
      break;

    case "hero":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Hero", "section", {
            paddingTop: "80px",
            paddingBottom: "80px",
            textAlign: "center",
          }),
        },
      });
      break;

    case "features":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Features Grid", "container", {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "20px",
          }),
        },
      });
      break;

    case "faq":
    case "accordion":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("FAQ Accordion", "container", {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }),
        },
      });
      break;

    case "footer":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Footer", "section", {
            borderTop: "1px solid #222222",
            paddingTop: "24px",
            paddingBottom: "24px",
          }),
        },
      });
      break;

    case "spacer":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Spacer", "container", {
            height: "40px",
          }),
        },
      });
      break;

    case "divider":
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createContainerElement("Divider", "container", {
            height: "1px",
            background: "#222222",
            width: "100%",
          }),
        },
      });
      break;

    default:
      dispatch({
        type: "ADD_ELEMENT",
        payload: {
          containerId: id,
          elementDetails: createTextElement(
            componentType,
            "text",
            `${componentType} element`
          ),
        },
      });
      break;
  }
};