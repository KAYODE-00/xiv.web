"use client";

import React from "react";
import { createClient } from "@supabase/supabase-js";

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
};

const MediaTab = ({ siteId }) => {
  const [files, setFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const fetchMedia = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .storage
        .from("site-media")
        .list(`${siteId}/`, {
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (siteId) fetchMedia();
  }, [siteId]);

  const handleUpload = async (e) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${siteId}/${Date.now()}-${file.name}`;
      const { error } = await supabase
        .storage
        .from("site-media")
        .upload(fileName, file);

      if (error) throw error;
      await fetchMedia();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    try {
      const { error } = await supabase
        .storage
        .from("site-media")
        .remove([`${siteId}/${fileName}`]);

      if (error) throw error;
      await fetchMedia();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getPublicUrl = (fileName) => {
    const supabase = getSupabaseClient();
    if (!supabase) return "";
    const { data } = supabase
      .storage
      .from("site-media")
      .getPublicUrl(`${siteId}/${fileName}`);
    return data.publicUrl;
  };

  const handleCopyUrl = (fileName) => {
    const url = getPublicUrl(fileName);
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex flex-col">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1e1e2e]">
        <h3 className="text-white font-semibold">Media</h3>
        <p className="text-gray-500 text-xs mt-1">
          Upload and manage your images
        </p>
      </div>

      {/* Upload Button */}
      <div className="px-6 py-4 border-b border-[#1e1e2e]">
        <label className={`
          w-full flex items-center justify-center gap-2
          py-2 px-4 rounded-md text-sm font-semibold
          cursor-pointer transition-all
          ${uploading
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-[#6c63ff] text-white hover:bg-[#7c74ff]"
          }
        `}>
          {uploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="px-4 py-4 overflow-auto">
        {!process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-500 text-sm">
              Supabase env vars missing
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-gray-500 text-sm">Loading media...</div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center
            py-16 gap-3 text-gray-600">
            <div className="text-4xl">🖼</div>
            <p className="text-sm">No images yet</p>
            <p className="text-xs text-center">
              Upload images to use in your site
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {files.map((file) => (
              <div
                key={file.name}
                className="group relative rounded-lg overflow-hidden
                border border-[#1e1e2e] bg-[#111118]
                hover:border-[#6c63ff] transition-all"
              >
                {/* Image Preview */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getPublicUrl(file.name)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* File Name */}
                <div className="px-2 py-1.5">
                  <p className="text-xs text-gray-400 truncate">
                    {file.name.split("-").slice(1).join("-")}
                  </p>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60
                  opacity-0 group-hover:opacity-100
                  transition-opacity flex items-center
                  justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(file.name)}
                    title="Copy URL"
                    className="w-8 h-8 rounded-md bg-[#6c63ff]
                    text-white text-xs flex items-center
                    justify-center hover:bg-[#7c74ff]"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    title="Delete"
                    className="w-8 h-8 rounded-md bg-red-500/80
                    text-white text-xs flex items-center
                    justify-center hover:bg-red-500"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaTab
