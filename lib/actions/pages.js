"use server";

import { createClient } from "@/lib/supabase/server";

// Save page content to Supabase
export const savePage = async ({ pageId, siteId, content, name }) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .update({
      content,
      name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Load page from Supabase
export const loadPage = async (pageId) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", pageId)
    .single();

  if (error) throw error;
  return data;
};

// Create new page
export const createPage = async ({ siteId, name, slug }) => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const defaultContent = JSON.stringify([
      {
        content: [],
        id: "__body",
        name: "Body",
        styles: {},
        type: "__body",
      },
    ]);

    const { data, error } = await supabase
      .from("pages")
      .insert({
        site_id: siteId,
        name,
        slug,
        content: defaultContent,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("createPage Supabase error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    return data;
  } catch (err) {
    console.error("createPage error:", err);
    throw err;
  }
};

// Delete page
export const deletePage = async (pageId) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", pageId);

  if (error) throw error;
  return true;
};

// Get all pages for a site
export const getSitePages = async (siteId) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

// Rename page
export const renamePage = async (pageId, name) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .update({ name })
    .eq("id", pageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
