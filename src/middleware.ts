import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/onboarding"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/signup"];
const ADMIN_EMAILS = ["admin@stampify.app"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Only run if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || supabaseUrl.includes("YOUR_PROJECT") || !supabaseKey || supabaseKey.includes("YOUR_ANON")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (user && AUTH_ROUTES.some(r => path.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect merchant dashboard
  if (PROTECTED_ROUTES.some(r => path.startsWith(r)) && !user) {
    return NextResponse.redirect(new URL(`/login?redirect=${path}`, request.url));
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some(r => path.startsWith(r))) {
    if (!user) return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
    if (!ADMIN_EMAILS.includes(user.email ?? "")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)"],
};
