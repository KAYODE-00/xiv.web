import { supabase } from "@/lib/supabase";

// Save page content to Supabase
export const savePage = async ({ pageId, siteId, content, name }) => {
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
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete page
export const deletePage = async (pageId) => {
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", pageId);

  if (error) throw error;
  return true;
};

// Get all pages for a site
export const getSitePages = async (siteId) => {
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
  const { data, error } = await supabase
    .from("pages")
    .update({ name })
    .eq("id", pageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
