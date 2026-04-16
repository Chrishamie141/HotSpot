import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth/users";
import { applySessionCookie, createSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createUser({
      username: String(body.username ?? ""),
      displayName: String(body.displayName ?? ""),
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
      avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl : "",
      bio: typeof body.bio === "string" ? body.bio : "",
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const token = await createSession(result.user.id);
    const response = NextResponse.json({ user: result.user }, { status: 201 });
    applySessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
