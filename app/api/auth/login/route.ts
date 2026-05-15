import { NextResponse } from "next/server";

import { authenticateWithBackend } from "@/lib/auth/backend";
import { loginSchema } from "@/lib/auth/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Check the highlighted fields.", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  return authenticateWithBackend(parsed.data);
}
