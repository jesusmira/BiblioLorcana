import type { Page } from "@playwright/test";

/**
 * Simula que el usuario ya aceptó las cookies para evitar que el banner
 * tape elementos y bloquee los clicks en los tests.
 * Debe llamarse ANTES de navegar a la página.
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const consentState = JSON.stringify({
      state: {
        consent: {
          essential: true,
          analytics: false,
          marketing: false,
          functional: false,
          acceptedAt: new Date().toISOString(),
        },
        hasConsented: true,
      },
      version: 0,
    });
    localStorage.setItem("cookie_consent", consentState);
  });
}

const MOCK_USER = {
  id: "test-user-id",
  name: "Usuario Test",
  email: "test@bibliolorcana.com",
  role: "USER" as const,
};

/**
 * Simula un usuario autenticado mockeando el endpoint de sesión legacy.
 * El AuthContext llama a /api/auth/me cuando Supabase no tiene sesión activa.
 * Debe llamarse ANTES de navegar a la página.
 */
export async function mockAuthenticatedUser(page: Page): Promise<void> {
  await page.route("/api/auth/me", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user: MOCK_USER }),
    })
  );
}

/**
 * Simula una respuesta de error en el login para probar credenciales inválidas.
 * Mockea tanto Supabase como la API legacy para forzar el error.
 */
export async function mockFailedLogin(page: Page): Promise<void> {
  // Bloquea Supabase signInWithPassword para que falle y el código use la API legacy
  await page.route("**/auth/v1/token**", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "invalid_grant", error_description: "Invalid login credentials" }),
    })
  );

  // La API legacy devuelve error con un pequeño delay para que el estado
  // "isSubmitting" sea visible el tiempo suficiente para que Playwright lo capture
  await page.route("/api/auth/login", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "Credenciales inválidas" }),
    });
  });
}
