"use server";

import { createClient } from "@/lib/supabase/server";

export const getUserSites = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("sites")
    .select("*, pages(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getSite = async (siteId) => {
  if (!siteId) return null;
  
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sites")
      .select("*, pages(*)")
      .eq("id", siteId)
      .single();

    if (error) {
      console.error("Supabase getSite error:", error);
      throw error;
    }
    return data || null;
  } catch (err) {
    console.error("getSite error:", err);
    throw err;
  }
};

export const createSite = async ({ name, accentColor }) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .insert({
      name,
      slug: `${slug}-${Date.now()}`,
      accent_color: accentColor || "#6c63ff",
      user_id: user.id,
    })
    .select()
    .single();

  if (siteError) throw siteError;

  // Create default home page
  const defaultContent = JSON.stringify([
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ]);

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .insert({
      site_id: site.id,
      name: "Home",
      slug: "home",
      content: defaultContent,
      user_id: user.id,
    })
    .select()
    .single();

  if (pageError) throw pageError;
  return { site, page };
};
