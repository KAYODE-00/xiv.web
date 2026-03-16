"use client";

import React from "react";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import { createClient } from "@supabase/supabase-js";
import { resolveDeviceStyles } from "@/lib/editor/utils";

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
};

// Simple built-in contact form
// replaces Plura's EditorContactForm component
const ContactForm = ({ title, subTitle, buttonText, styles, onSubmit }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ name, email });
    setLoading(false);
    setName("");
    setEmail("");
  };

  return (
    <div
      style={styles}
      className="w-full p-6 flex flex-col gap-4
      bg-white rounded-lg shadow-sm"
    >
      {title && (
        <h3 className="text-xl font-bold text-gray-900">
          {title}
        </h3>
      )}
      {subTitle && (
        <p className="text-gray-500 text-sm">{subTitle}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md border
          border-gray-200 text-gray-900 text-sm
          outline-none focus:border-[#6c63ff]
          transition-colors"
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md border
          border-gray-200 text-gray-900 text-sm
          outline-none focus:border-[#6c63ff]
          transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-md
          bg-[#6c63ff] text-white font-semibold
          text-sm hover:bg-[#7c74ff] transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : buttonText || "Submit"}
        </button>
      </form>
    </div>
  );
};

const EditorContact = ({ element }) => {
  const { dispatch, editor: editorState, siteId } = useEditor();
  const { editor } = editorState;
  const device = editor.device;
  const deviceStyles = resolveDeviceStyles(element.styles, device);

  const isSelected = editor.selectedElement.id === element.id;
  const isLive = editor.liveMode;
  const isPreview = editor.previewMode;

  const handleOnClickBody = (e) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const onFormSubmit = async (values) => {
    if (!isLive && !isPreview) return;

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        toast.error("Supabase env vars missing");
        return;
      }
      // Save contact to Supabase
      const { error } = await supabase
        .from("contacts")
        .insert({
          name: values.name,
          email: values.email,
          site_id: siteId,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Successfully saved your info!");
    } catch (error) {
      toast.error("Could not save your information");
    }
  };

  return (
    <div
      onClick={handleOnClickBody}
      className={`
        p-[2px] w-full m-[5px] relative
        text-base transition-all
        flex items-center justify-center
        ${!isLive ? "border-dashed border border-gray-600" : ""}
        ${isSelected && !isLive
          ? "border-solid border-blue-500"
          : ""
        }
      `}
    >
      {/* Element name badge */}
      {isSelected && !isLive && (
        <div className="absolute -top-[23px] -left-[1px]
          bg-[#6c63ff] text-white text-xs font-bold
          px-2 py-0.5 rounded-t-lg z-10">
          {editor.selectedElement.name}
        </div>
      )}

      {/* Contact Form */}
      {!Array.isArray(element.content) && (
        <ContactForm
          title={element.content.formTitle}
          subTitle={element.content.formDescription}
          buttonText={element.content.formButton}
          styles={deviceStyles}
          onSubmit={onFormSubmit}
        />
      )}

      {/* Delete button */}
      {isSelected && !isLive && (
        <div
          onClick={handleDeleteElement}
          className="absolute -top-[25px] -right-[1px]
          bg-[#6c63ff] px-2 py-1 rounded-t-lg
          cursor-pointer z-10"
        >
          <Trash className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default EditorContact;
