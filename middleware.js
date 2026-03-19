import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/dashboard", "/builder"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If visiting protected route without auth
  // redirect to login
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // If logged in and visiting auth page
  // redirect to dashboard
  if (pathname === "/auth" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};