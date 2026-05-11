import { NextRequest, NextResponse } from "next/server";
import { registerUser, setSession } from "@/lib/auth-utils";
import { registerSchema, validateRequest } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();

    const validation = validateRequest(registerSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const user = await registerUser({ name, email, password });

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
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
