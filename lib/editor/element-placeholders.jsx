import {
  ContactFormPlaceholder,
  ContainerPlaceholder,
  ImagePlaceholder,
  LinkPlaceholder,
  PaymentFormPlaceholder,
  TextPlaceholder,
  ThreeColumnsPlaceholder,
  TwoColumnsPlaceholder,
  VideoPlaceholder,
  SectionPlaceholder,
} from "@/components/placeholders";

export const ELEMENT_LAYOUT_PLACEHOLDERS = [
  {
    placeholder: <SectionPlaceholder />,
    label: "Section",
    id: "section",
    group: "layout",
  },
  {
    placeholder: <ContainerPlaceholder />,
    label: "Container",
    id: "container",
    group: "layout",
  },
  {
    placeholder: <TwoColumnsPlaceholder />,
    label: "2 Columns",
    id: "2Col",
    group: "layout",
  },
  {
    placeholder: <ThreeColumnsPlaceholder />,
    label: "3 Columns",
    id: "3Col",
    group: "layout",
  },
];

export const ELEMENT_PRIMITIVE_PLACEHOLDERS = [
  {
    placeholder: <TextPlaceholder />,
    label: "Text",
    id: "text",
    group: "elements",
  },
  {
    placeholder: <ImagePlaceholder />,
    label: "Image",
    id: "image",
    group: "elements",
  },
  {
    placeholder: <VideoPlaceholder />,
    label: "Video",
    id: "video",
    group: "elements",
  },
  {
    placeholder: <LinkPlaceholder />,
    label: "Link",
    id: "link",
    group: "elements",
  },
  {
    placeholder: <ContactFormPlaceholder />,
    label: "Contact",
    id: "contactForm",
    group: "elements",
  },
  {
    placeholder: <PaymentFormPlaceholder />,
    label: "Payment",
    id: "paymentForm",
    group: "elements",
  },
];
