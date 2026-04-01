import { NextResponse } from "next/server";
import { loginUser, setSession } from "../../../lib/auth-utils";
import { loginSchema, validateRequest } from "../../../lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = validateRequest(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await loginUser({ email, password });

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error en el servidor";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
