import { test, expect } from "@playwright/test";

test.describe("Rutas públicas", () => {
  test.describe("Página de galería (/galeria)", () => {
    test("carga correctamente sin autenticación", async ({ page }) => {
      const response = await page.goto("/galeria");
      expect(response?.status()).toBeLessThan(400);
    });

    test("muestra el campo de búsqueda", async ({ page }) => {
      await page.goto("/galeria");
      await expect(page.getByRole("searchbox")).toBeVisible();
    });

    test("muestra el label de búsqueda", async ({ page }) => {
      await page.goto("/galeria");
      await expect(page.getByText("Busqueda", { exact: true })).toBeVisible();
    });
  });

  test.describe("Página de login (/login)", () => {
    test("carga correctamente", async ({ page }) => {
      const response = await page.goto("/login");
      expect(response?.status()).toBeLessThan(400);
    });

    test("muestra el título Login", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    });

    test("muestra los campos email y contraseña", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
    });

    test("muestra el botón de submit", async ({ page }) => {
      await page.goto("/login");
      await expect(
        page.getByRole("button", { name: "Iniciar sesión" })
      ).toBeVisible();
    });

    test("muestra los botones de OAuth (Google y GitHub)", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("button", { name: /Google/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /GitHub/i })).toBeVisible();
    });

    test("tiene enlace a la página de registro", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("link", { name: "Registrate" })).toBeVisible();
    });

    test("tiene enlace a recuperar contraseña", async ({ page }) => {
      await page.goto("/login");
      await expect(
        page.getByRole("link", { name: /Olvidaste tu contraseña/i })
      ).toBeVisible();
    });
  });

  test.describe("Página de registro (/registro)", () => {
    test("carga correctamente", async ({ page }) => {
      const response = await page.goto("/registro");
      expect(response?.status()).toBeLessThan(400);
    });

    test("muestra el título Registro", async ({ page }) => {
      await page.goto("/registro");
      await expect(
        page.getByRole("heading", { name: "Registro" })
      ).toBeVisible();
    });

    test("muestra todos los campos del formulario", async ({ page }) => {
      await page.goto("/registro");
      await expect(page.locator("#name")).toBeVisible();
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(page.locator("#confirmPassword")).toBeVisible();
    });

    test("tiene enlace de vuelta al login", async ({ page }) => {
      await page.goto("/registro");
      await expect(
        page.getByRole("link", { name: "Iniciar sesión" })
      ).toBeVisible();
    });
  });
});
