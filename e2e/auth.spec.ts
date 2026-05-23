import { test, expect } from "@playwright/test";
import { mockFailedLogin, dismissCookieBanner } from "./fixtures/auth";

test.describe("Formulario de login", () => {
  test.beforeEach(async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/login");
  });

  test("muestra error de validación al enviar formulario vacío", async ({ page }) => {
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(
      page.getByText("El email o usuario es requerido")
    ).toBeVisible();
    await expect(page.getByText("La contraseña es requerida")).toBeVisible();
  });

  test("muestra error solo de contraseña cuando el email es válido", async ({ page }) => {
    await page.locator("#email").fill("usuario@test.com");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(page.getByText("La contraseña es requerida")).toBeVisible();
    await expect(
      page.getByText("El email o usuario es requerido")
    ).not.toBeVisible();
  });

  test("muestra error de API con credenciales inválidas", async ({ page }) => {
    await mockFailedLogin(page);

    await page.locator("#email").fill("noexiste@test.com");
    await page.locator("#password").fill("ContraseñaWrong1!");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // El apiError se muestra como mensaje visible
    await expect(page.getByText("Credenciales inválidas")).toBeVisible({
      timeout: 8000,
    });
  });

  test("el botón muestra 'Iniciando sesión...' mientras procesa", async ({ page }) => {
    await mockFailedLogin(page);

    await page.locator("#email").fill("usuario@test.com");
    await page.locator("#password").fill("Contrasena1!");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Durante el envío, el texto del botón cambia
    await expect(
      page.getByRole("button", { name: "Iniciando sesión..." })
    ).toBeVisible();
  });

  test("el toggle de visibilidad de contraseña funciona", async ({ page }) => {
    const passwordInput = page.locator("#password");
    await passwordInput.fill("micontrasena");

    // Por defecto es tipo password
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Click en el botón de mostrar
    await page
      .getByRole("button", { name: "Mostrar contraseña" })
      .click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    // Click para ocultar de nuevo
    await page
      .getByRole("button", { name: "Ocultar contraseña" })
      .click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("los errores de validación desaparecen al corregir el campo", async ({ page }) => {
    // Enviar vacío para provocar error
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(page.getByText("El email o usuario es requerido")).toBeVisible();

    // Escribir en el campo
    await page.locator("#email").fill("correo@valido.com");
    await expect(
      page.getByText("El email o usuario es requerido")
    ).not.toBeVisible();
  });

  test("navega a /registro al hacer clic en 'Registrate'", async ({ page }) => {
    await page.getByRole("link", { name: "Registrate" }).click();
    await expect(page).toHaveURL("/registro");
  });

  test("navega a /olvide-contrasena al hacer clic en el enlace", async ({ page }) => {
    await page.getByRole("link", { name: /Olvidaste tu contraseña/i }).click();
    await expect(page).toHaveURL("/olvide-contrasena");
  });
});

test.describe("Formulario de registro", () => {
  test.beforeEach(async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/registro");
  });

  test("muestra errores de validación al enviar formulario vacío", async ({ page }) => {
    await page.getByRole("button", { name: "Registrarse" }).click();
    await expect(page.getByText("El nombre es requerido")).toBeVisible();
    await expect(page.getByText("El email es requerido")).toBeVisible();
    await expect(page.getByText("La contraseña es requerida")).toBeVisible();
  });

  test("muestra error cuando las contraseñas no coinciden", async ({ page }) => {
    await page.locator("#name").fill("María García");
    await page.locator("#email").fill("maria@test.com");
    await page.locator("#password").fill("Segura1!");
    await page.locator("#confirmPassword").fill("DiferenteClave1!");
    await page.getByRole("button", { name: "Registrarse" }).click();

    await expect(
      page.getByText("Las contraseñas no coinciden")
    ).toBeVisible();
  });

  test("muestra error cuando la contraseña no tiene mayúscula", async ({ page }) => {
    await page.locator("#name").fill("Test User");
    await page.locator("#email").fill("test@test.com");
    await page.locator("#password").fill("sinmayuscula1!");
    await page.locator("#confirmPassword").fill("sinmayuscula1!");
    await page.getByRole("button", { name: "Registrarse" }).click();

    await expect(page.getByText("Al menos una mayúscula")).toBeVisible();
  });

  test("muestra error cuando la contraseña no tiene carácter especial", async ({ page }) => {
    await page.locator("#name").fill("Test User");
    await page.locator("#email").fill("test@test.com");
    await page.locator("#password").fill("SinEspecial1");
    await page.locator("#confirmPassword").fill("SinEspecial1");
    await page.getByRole("button", { name: "Registrarse" }).click();

    await expect(
      page.getByText("Al menos un carácter especial")
    ).toBeVisible();
  });

  test("muestra error de email inválido", async ({ page }) => {
    // "test@test" pasa la validación HTML5 del browser (type="email") pero falla la
    // validación de Zod que exige TLD (al menos un punto en el dominio).
    await page.locator("#name").fill("Test");
    await page.locator("#email").fill("test@test");
    await page.getByRole("button", { name: "Registrarse" }).click();

    await expect(page.getByText("Email inválido")).toBeVisible();
  });

  test("los toggles de visibilidad de contraseña funcionan", async ({ page }) => {
    const password = page.locator("#password");
    const confirm = page.locator("#confirmPassword");

    await password.fill("test");
    await confirm.fill("test");

    await expect(password).toHaveAttribute("type", "password");
    await expect(confirm).toHaveAttribute("type", "password");

    // Mostrar primera contraseña
    await page.getByRole("button", { name: "Mostrar contraseña" }).first().click();
    await expect(password).toHaveAttribute("type", "text");
    await expect(confirm).toHaveAttribute("type", "password");

    // Mostrar segunda contraseña
    await page.getByRole("button", { name: "Mostrar contraseña" }).last().click();
    await expect(confirm).toHaveAttribute("type", "text");
  });

  test("navega a /login al hacer clic en 'Iniciar sesión'", async ({ page }) => {
    await page.getByRole("link", { name: "Iniciar sesión" }).click();
    await expect(page).toHaveURL("/login");
  });
});
