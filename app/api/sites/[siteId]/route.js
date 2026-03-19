import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Await params for Next.js 16
    const resolvedParams = await params;
    const { siteId } = resolvedParams;

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    console.log("[API] Fetching site:", siteId);

    // Use raw fetch to Supabase REST API
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!baseUrl || !anonKey) {
      console.error("[API] Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // First, try to fetch the site with pages
    const url = `${baseUrl}/rest/v1/sites?id=eq.${encodeURIComponent(siteId)}&select=*,pages(*)`;
    
    console.log("[API] Making request to Supabase REST API");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
    });

    console.log("[API] Response status:", response.status);

    const text = await response.text();
    console.log("[API] Response body length:", text.length);

    if (!response.ok) {
      console.error("[API] Supabase request failed:", {
        status: response.status,
        statusText: response.statusText,
        body: text.substring(0, 200),
      });
      
      // If nested select fails, try without it
      if (response.status === 400 || response.status === 404) {
        console.log("[API] Retrying without nested select");
        const fallbackUrl = `${baseUrl}/rest/v1/sites?id=eq.${encodeURIComponent(siteId)}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: "GET",
          headers: {
            "apikey": anonKey,
            "Authorization": `Bearer ${anonKey}`,
            "Content-Type": "application/json",
          },
        });

        if (!fallbackResponse.ok) {
          return NextResponse.json(
            { error: "Site not found", siteId },
            { status: 404 }
          );
        }

        const siteData = await fallbackResponse.json();
        if (!Array.isArray(siteData) || siteData.length === 0) {
          return NextResponse.json(
            { error: "Site not found", siteId },
            { status: 404 }
          );
        }

        // Now fetch pages separately
        const pagesUrl = `${baseUrl}/rest/v1/pages?site_id=eq.${encodeURIComponent(siteData[0].id)}`;
        const pagesResponse = await fetch(pagesUrl, {
          method: "GET",
          headers: {
            "apikey": anonKey,
            "Authorization": `Bearer ${anonKey}`,
            "Content-Type": "application/json",
          },
        });

        if (pagesResponse.ok) {
          const pages = await pagesResponse.json();
          siteData[0].pages = pages;
        }

        console.log("[API] Site fetched successfully (with pages):", siteData[0].id);
        return NextResponse.json(siteData[0]);
      }

      return NextResponse.json(
        { error: "Failed to fetch site" },
        { status: response.status }
      );
    }

    const data = JSON.parse(text);
    console.log("[API] Parsed data, array length:", Array.isArray(data) ? data.length : "not array");

    if (!Array.isArray(data) || data.length === 0) {
      console.log("[API] Site not found for ID:", siteId);
      return NextResponse.json(
        { error: "Site not found", siteId, availableData: !data ? "null" : typeof data },
        { status: 404 }
      );
    }

    console.log("[API] Site fetched successfully:", data[0].id);
    return NextResponse.json(data[0]);
  } catch (err) {
    console.error("[API] Exception:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    return NextResponse.json(
      { error: "Internal server error", message: err.message },
      { status: 500 }
    );
  }
}
