import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const AUTH_COOKIE_NAME = "hotspot_user_id";

function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };
}

export async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, userId, getAuthCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!cookieUserId) return null;

  return prisma.user.findUnique({
    where: { id: cookieUserId },
    include: { socialProfile: true },
  });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}

// retained for development compatibility only
export async function getOrCreateLocalUser() {
  const existing = await getCurrentUser();
  if (existing) return existing;

  const timestamp = Date.now();
  const handle = `user${timestamp}`;
  const email = `${handle}@local.hotspot`;

  const created = await prisma.user.create({
    data: {
      email,
      displayName: "New HotSpot User",
      socialProfile: {
        create: {
          handle,
          displayName: "New HotSpot User",
          bio: "",
          cityLine: "",
          onboardingCompleted: false,
        },
      },
    },
    include: { socialProfile: true },
  });

  await setAuthCookie(created.id);
  return created;
}
