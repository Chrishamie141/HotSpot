import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/data/json-store";
import { UserSession } from "@/lib/auth/types";
import { findUserById } from "@/lib/auth/users";

const SESSIONS_FILE = "sessions.json";
export const SESSION_COOKIE = "nightpulse_session";

async function listSessions() {
  return readJsonFile<UserSession[]>(SESSIONS_FILE, []);
}

export async function createSession(userId: string) {
  const sessions = await listSessions();
  const token = randomUUID();

  const next: UserSession = {
    token,
    userId,
    createdAt: new Date().toISOString(),
  };

  await writeJsonFile(SESSIONS_FILE, [next, ...sessions.filter((item) => item.userId !== userId)]);
  return token;
}

export async function destroySession(token: string) {
  const sessions = await listSessions();
  await writeJsonFile(
    SESSIONS_FILE,
    sessions.filter((item) => item.token !== token)
  );
}

export async function getSessionFromToken(token: string) {
  const sessions = await listSessions();
  return sessions.find((item) => item.token === token) ?? null;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await getSessionFromToken(token);
  if (!session) return null;

  return findUserById(session.userId);
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
