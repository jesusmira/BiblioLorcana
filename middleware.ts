import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verificar sesión legacy
  const authToken = request.cookies.get("auth_token")?.value;
  let hasLegacyUser = false;
  if (authToken) {
    try {
      const JWT_SECRET = new TextEncoder().encode(
        process.env.JWT_SECRET || "biblioLor-secret-key-change-in-production",
      );
      const { jwtVerify } = await import("jose");
      await jwtVerify(authToken, JWT_SECRET);
      hasLegacyUser = true;
    } catch (e) {
      // Token inválido o expirado
    }
  }

  // Redirigir si ya está autenticado e intenta acceder a páginas de auth
  const authPages = [
    "/login",
    "/registro",
    "/olvide-contrasena",
    "/restablecer-contrasena",
  ];
  const isAuthPage = authPages.some((page) =>
    request.nextUrl.pathname.startsWith(page),
  );

  if ((user || hasLegacyUser) && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
