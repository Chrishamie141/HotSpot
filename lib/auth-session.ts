import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "hotspot_session";
export const LEGACY_AUTH_COOKIE_NAME = "hotspot_user_id";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

type SessionPayload = { userId: string; onboardingCompleted: boolean; iat: number; exp: number };

function getJwtSecret() {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || "dev-hotspot-auth-secret";
}

function base64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function sign(input: string) {
  return createHmac("sha256", getJwtSecret()).update(input).digest("base64url");
}

function encodeToken(payload: SessionPayload) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

function decodeToken(token: string): SessionPayload | null {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;
  const expectedSig = sign(`${header}.${body}`);
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  if (!valid) return null;
  const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as SessionPayload;
  if (!parsed.userId || parsed.exp * 1000 < Date.now()) return null;
  return parsed;
}

function cookieOptions(maxAge: number = SESSION_TTL_SECONDS) {
  return { httpOnly: true, sameSite: "lax" as const, path: "/", secure: process.env.NODE_ENV === "production", maxAge };
}

export async function setSessionCookie(userId: string, onboardingCompleted: boolean) {
  const now = Math.floor(Date.now() / 1000);
  const token = encodeToken({ userId, onboardingCompleted, iat: now, exp: now + SESSION_TTL_SECONDS });
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, cookieOptions());
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", cookieOptions(0));
  cookieStore.set(LEGACY_AUTH_COOKIE_NAME, "", cookieOptions(0));
}

export async function getCurrentUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.userId }, include: { socialProfile: true } });
}
