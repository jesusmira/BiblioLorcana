import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  validateRequest,
} from "@/lib/schemas";

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    const result = loginSchema.safeParse({ email: "user@test.com", password: "123" });
    expect(result.success).toBe(true);
  });

  it("rechaza email vacío", () => {
    const result = loginSchema.safeParse({ email: "", password: "123" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña vacía", () => {
    const result = loginSchema.safeParse({ email: "user@test.com", password: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza si faltan ambos campos", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const VALID_INPUT = {
    name: "María García",
    email: "maria@test.com",
    password: "Segura1!",
    confirmPassword: "Segura1!",
  };

  it("acepta datos de registro válidos", () => {
    const result = registerSchema.safeParse(VALID_INPUT);
    expect(result.success).toBe(true);
  });

  it("rechaza nombre vacío", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, name: "" });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre de 1 carácter", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rechaza email con formato inválido", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, email: "no-es-email" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña sin mayúscula", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, password: "segura1!", confirmPassword: "segura1!" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña sin número", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, password: "Seguraa!", confirmPassword: "Seguraa!" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña sin carácter especial", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, password: "Segura11", confirmPassword: "Segura11" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña menor de 8 caracteres", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, password: "Seg1!", confirmPassword: "Seg1!" });
    expect(result.success).toBe(false);
  });

  it("rechaza si las contraseñas no coinciden", () => {
    const result = registerSchema.safeParse({ ...VALID_INPUT, confirmPassword: "OtraContra1!" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("confirmPassword");
    }
  });
});

describe("validateRequest", () => {
  it("devuelve success:true con los datos cuando son válidos", () => {
    const result = validateRequest(loginSchema, { email: "a@b.com", password: "123" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("a@b.com");
    }
  });

  it("devuelve success:false con array de errores cuando son inválidos", () => {
    const result = validateRequest(loginSchema, { email: "", password: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("los mensajes de error son strings legibles", () => {
    const result = validateRequest(loginSchema, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      result.errors.forEach((err) => expect(typeof err).toBe("string"));
    }
  });
});
