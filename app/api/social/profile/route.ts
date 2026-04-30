import { NextResponse } from "next/server";
import { getCurrentUserFromSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUserFromSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [postsCount, followers, following, posts] = await Promise.all([
    prisma.socialPost.count({ where: { userId: user.id } }),
    prisma.socialFollow.count({ where: { followingId: user.id } }),
    prisma.socialFollow.count({ where: { followerId: user.id } }),
    prisma.socialPost.findMany({ where: { userId: user.id }, include: { media: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({
    profile: {
      displayName: user.socialProfile?.displayName ?? user.displayName ?? "User",
      username: `@${user.socialProfile?.handle ?? "user"}`,
      bio: user.socialProfile?.bio ?? "",
      cityLine: user.socialProfile?.cityLine ?? "",
      avatarUrl: user.socialProfile?.avatarUrl ?? "",
      email: user.email,
      accountId: user.id,
      isPrivate: user.socialProfile?.isPrivate ?? false,
      notificationsEnabled: user.socialProfile?.notificationsEnabled ?? true,
      showVideos: user.socialProfile?.showVideos ?? true,
      showNightlifeEvents: user.socialProfile?.showNightlifeEvents ?? true,
      showFoodSpots: user.socialProfile?.showFoodSpots ?? true,
      preferredVibes: user.socialProfile?.preferredVibes ?? [],
      followers,
      following,
      postsCount,
    },
    posts: posts.map((post) => ({
      id: post.id,
      username: `@${user.socialProfile?.handle ?? "user"}`,
      avatarUrl: user.socialProfile?.avatarUrl ?? "",
      venue: post.venueName ?? "",
      location: post.location ?? "",
      postedAt: post.createdAt.toISOString(),
      mediaUrl: post.media[0]?.mediaUrl ?? "",
      mediaType: post.media[0]?.mediaType === "video" ? "video" : "image",
      caption: post.caption,
      vibeScore: post.vibeScore ?? 0,
      venueAverageVibe: post.vibeScore ?? 0,
      commentsCount: 0,
    })),
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUserFromSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  const handle = body.username ? String(body.username).replace(/^@/, "").trim().toLowerCase() : undefined;
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : undefined;

  const profile = await prisma.socialProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      handle: handle || `user${Date.now()}`,
      displayName: displayName || user.displayName || "User",
      bio: body.bio,
      cityLine: body.cityLine,
      avatarUrl: body.avatarUrl,
      isPrivate: body.isPrivate,
      notificationsEnabled: body.notificationsEnabled,
      showVideos: body.showVideos,
      showNightlifeEvents: body.showNightlifeEvents,
      showFoodSpots: body.showFoodSpots,
      preferredVibes: body.preferredVibes ?? [],
      onboarding: body.onboarding ?? {},
      onboardingCompleted: typeof body.onboardingCompleted === "boolean" ? body.onboardingCompleted : false,
    },
    update: {
      handle: handle,
      displayName: displayName,
      bio: body.bio,
      cityLine: body.cityLine,
      avatarUrl: body.avatarUrl,
      isPrivate: body.isPrivate,
      notificationsEnabled: body.notificationsEnabled,
      showVideos: body.showVideos,
      showNightlifeEvents: body.showNightlifeEvents,
      showFoodSpots: body.showFoodSpots,
      preferredVibes: body.preferredVibes,
      onboarding: body.onboarding,
      onboardingCompleted: body.onboardingCompleted,
    },
  });

  if (displayName) {
    await prisma.user.update({ where: { id: user.id }, data: { displayName } });
  }

  return NextResponse.json({ ok: true, handle: profile.handle });
}
