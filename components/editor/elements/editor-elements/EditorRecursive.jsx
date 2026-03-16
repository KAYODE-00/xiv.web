import React from "react";

import EditorContact from "./EditorContact";
import EditorText from "./EditorText";
import EditorImage from "./EditorImage";
import EditorContainer from "./EditorContainer";
import EditorSection from "./EditorSection";
import EditorVideo from "./EditorVideo";
import EditorPayment from "./EditorPayment";
import EditorLink from "./EditorLink";

const EditorRecursive = ({ element }) => {
  switch (element.type) {
    case "text":
      return <EditorText element={element} />;
    case "image":
      return <EditorImage element={element} />;
    case "container":
      return <EditorContainer element={element} />;
    case "__body":
      return <EditorContainer element={element} />;
    case "2Col":
      return <EditorContainer element={element} />;
    case "3Col":
      return <EditorContainer element={element} />;
    case "section":
      return <EditorSection element={element} />;
    case "video":
      return <EditorVideo element={element} />;
    case "link":
      return <EditorLink element={element} />;
    case "contactForm":
      return <EditorContact element={element} />;
    case "paymentForm":
      return <EditorPayment element={element} />;
    default:
      return null;
  }
};

export default EditorRecursive;
