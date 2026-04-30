import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "hotspot_user_id";

export async function getOrCreateLocalUser() {
  const cookieStore = await cookies();
  const cookieUserId = cookieStore.get(COOKIE_NAME)?.value;

  if (cookieUserId) {
    const existing = await prisma.user.findUnique({ where: { id: cookieUserId }, include: { socialProfile: true } });
    if (existing) return existing;
  }

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
          preferredNightlifeTypes: [],
        },
      },
    },
    include: { socialProfile: true },
  });

  cookieStore.set(COOKIE_NAME, created.id, { httpOnly: true, sameSite: "lax", path: "/" });
  return created;
}
