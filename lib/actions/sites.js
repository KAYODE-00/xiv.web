import { supabase } from "@/lib/supabase";

// Get all sites for current user
export const getUserSites = async () => {
  const { data, error } = await supabase
    .from("sites")
    .select("*, pages(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Create new site
export const createSite = async ({ name, accentColor }) => {
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
    })
    .select()
    .single();

  if (pageError) throw pageError;

  return { site, page };
};

// Get single site with pages
export const getSite = async (siteId) => {
  const isUuid =
    typeof siteId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      siteId
    );

  const query = supabase.from("sites").select("*, pages(*)");
  const filteredQuery = isUuid
    ? query.eq("id", siteId)
    : query.eq("slug", siteId);
  const { data, error, status } = await filteredQuery.single();

  if (error) {
    if (error.code === "PGRST116" || status === 404) return null;
    throw error;
  }
  return data;
};

// Publish site
export const publishSite = async (siteId) => {
  const { data, error } = await supabase
    .from("sites")
    .update({ published: true })
    .eq("id", siteId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
