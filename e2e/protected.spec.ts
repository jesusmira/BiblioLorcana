import { test, expect } from "@playwright/test";
import { mockAuthenticatedUser } from "./fixtures/auth";

test.describe("Rutas protegidas — sin autenticación", () => {
  test("/mis-mazos muestra la pantalla de acceso restringido", async ({ page }) => {
    await page.goto("/mis-mazos");
    // AuthGuard muestra el título pasado por la página y el enlace de login
    await expect(page.getByRole("heading", { name: "Mis Mazos" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).toBeVisible();
  });

  test("/mis-cartas muestra la pantalla de acceso restringido", async ({ page }) => {
    await page.goto("/mis-cartas");
    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).toBeVisible();
  });

  test("/perfil muestra la pantalla de acceso restringido", async ({ page }) => {
    await page.goto("/perfil");
    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).toBeVisible();
  });

  test("el enlace 'Iniciar sesión' de AuthGuard lleva a /login", async ({ page }) => {
    await page.goto("/mis-mazos");
    await page.getByRole("link", { name: "Iniciar sesión" }).click();
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Rutas protegidas — con autenticación simulada", () => {
  test("/mis-mazos muestra contenido de usuario autenticado", async ({ page }) => {
    await mockAuthenticatedUser(page);
    await page.goto("/mis-mazos");

    // Esperar a que desaparezca el AuthGuard (el link "Iniciar sesión" NO debe aparecer)
    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).not.toBeVisible({ timeout: 8000 });

    // El título de la página debe ser el del contenido autenticado
    await expect(page.getByRole("heading", { name: "Mis Mazos" })).toBeVisible();
  });

  test("/mis-cartas muestra contenido de usuario autenticado", async ({ page }) => {
    await mockAuthenticatedUser(page);
    await page.goto("/mis-cartas");

    await expect(
      page.getByRole("link", { name: "Iniciar sesión" })
    ).not.toBeVisible({ timeout: 8000 });
  });
});

test.describe("Middleware — redirección de páginas de auth", () => {
  // El middleware redirige a / si el usuario ya está autenticado e intenta
  // acceder a /login o /registro. No se puede probar con mock de API client-side
  // porque el middleware corre en el servidor; se prueba el comportamiento del
  // cliente sin sesión activa, que es el flujo esperado sin auth real.

  test("/login es accesible sin sesión activa", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("/registro es accesible sin sesión activa", async ({ page }) => {
    await page.goto("/registro");
    await expect(page).toHaveURL("/registro");
    await expect(page.getByRole("heading", { name: "Registro" })).toBeVisible();
  });
});
