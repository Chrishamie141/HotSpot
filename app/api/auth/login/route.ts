import { NextRequest, NextResponse } from "next/server";
import { createSession, applySessionCookie } from "@/lib/auth/session";
import { findUserByLogin } from "@/lib/auth/users";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const login = String(body.login ?? "").trim();
    const password = String(body.password ?? "").trim();

    if (!login || !password) {
      return NextResponse.json({ error: "Email/username and password are required." }, { status: 400 });
    }

    const user = await findUserByLogin(login);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid login credentials." }, { status: 401 });
    }

    const token = await createSession(user.id);
    const response = NextResponse.json({ user });
    applySessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
