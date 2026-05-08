import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { createClient } from "./supabase-server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "biblioLor-secret-key-change-in-production"
);

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  
  // 1. Intentar con el token de sesión tradicional (JWT en cookie auth_token)
  const token = cookieStore.get("auth_token")?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) return payload;
  }

  // 2. Intentar con la sesión de Supabase (especialmente para login con Google/GitHub)
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (user && !error) {
      return {
        userId: user.id,
        email: user.email || "",
        name: user.user_metadata.full_name || user.email?.split("@")[0] || "Usuario",
        role: (user.user_metadata.role as "USER" | "ADMIN") || "USER",
      };
    }
  } catch (error) {
    console.error("Error al obtener la sesión de Supabase en getSession:", error);
  }

  return null;
}

export async function setSession(payload: TokenPayload): Promise<void> {
  const token = await createToken(payload);
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error("El correo electrónico ya está registrado");
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isValid = await verifyPassword(input.password, user.password);

  if (!isValid) {
    throw new Error("Credenciales inválidas");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
