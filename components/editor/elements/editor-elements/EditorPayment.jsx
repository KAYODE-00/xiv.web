"use client";

import React from "react";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import { resolveDeviceStyles } from "@/lib/editor/utils";

const EditorPayment = ({ element }) => {
  const { editor: editorState, dispatch, siteId } = useEditor();
  const { editor } = editorState;
  const device = editor.device;
  const deviceStyles = resolveDeviceStyles(element.styles, device);

  const isSelected = editor.selectedElement.id === element.id;
  const isLive = editor.liveMode;

  const [clientSecret, setClientSecret] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isLive || !siteId) return;

    const getClientSecret = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteId }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);
        if (data.clientSecret) setClientSecret(data.clientSecret);
      } catch (error) {
        toast.error("Could not load payment form");
      } finally {
        setLoading(false);
      }
    };

    getClientSecret();
  }, [isLive, siteId]);

  const handleOnClickBody = (event) => {
    event.stopPropagation();
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

  return (
    <div
      style={deviceStyles}
      draggable
      onClick={handleOnClickBody}
      className={`
        p-0.5 w-full m-1 relative text-base
        min-h-7 transition-all
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
        <div className="absolute -top-6 -left-0.5
          bg-[#6c63ff] text-white text-xs font-bold
          px-2 py-0.5 rounded-t-md z-10">
          {editor.selectedElement.name}
        </div>
      )}

      {/* Payment Content */}
      <div className="w-full">

        {/* Editor mode placeholder */}
        {!isLive && (
          <div className="w-full min-h-[120px] flex flex-col
            items-center justify-center gap-3
            bg-[#111118] border border-dashed
            border-[#1e1e2e] rounded-lg p-6">
            <div className="text-3xl">💳</div>
            <p className="text-gray-400 text-sm font-medium">
              Payment Form
            </p>
            <p className="text-gray-600 text-xs text-center">
              Stripe checkout will appear here
              when site is published
            </p>
          </div>
        )}

        {/* Live mode — Stripe checkout */}
        {isLive && (
          <>
            {loading && (
              <div className="w-full h-28 flex items-center
                justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#6c63ff]
                    border-t-transparent rounded-full animate-spin"
                  />
                  <p className="text-gray-500 text-xs">
                    Loading payment...
                  </p>
                </div>
              </div>
            )}

            {!loading && clientSecret && (
              <div className="w-full p-4 bg-white rounded-lg">
                <p className="text-gray-500 text-sm text-center">
                  Stripe checkout loaded ✓
                </p>
                {/* 
                  To enable full Stripe embedded checkout:
                  npm install @stripe/react-stripe-js @stripe/stripe-js
                  Then replace this with EmbeddedCheckoutProvider
                */}
              </div>
            )}

            {!loading && !clientSecret && (
              <div className="w-full h-28 flex flex-col
                items-center justify-center gap-2
                text-gray-500">
                <div className="text-2xl">💳</div>
                <p className="text-sm">
                  Connect Stripe in settings to enable payments
                </p>
              </div>
            )}
          </>
        )}
      </div>

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

export default EditorPayment;
