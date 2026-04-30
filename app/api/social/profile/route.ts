import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/social-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getOrCreateLocalUser();

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
      onboardingCompleted: user.socialProfile?.onboardingCompleted ?? false,
      preferredCity: user.socialProfile?.preferredCity ?? "",
      preferredNightlifeTypes: user.socialProfile?.preferredNightlifeTypes ?? [],
      ageRange: user.socialProfile?.ageRange ?? "",
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
  const user = await getOrCreateLocalUser();
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
      onboardingCompleted: Boolean(body.onboardingCompleted),
      preferredCity: typeof body.preferredCity === "string" ? body.preferredCity : null,
      preferredNightlifeTypes: Array.isArray(body.preferredNightlifeTypes) ? body.preferredNightlifeTypes : [],
      ageRange: typeof body.ageRange === "string" ? body.ageRange : null,
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
      onboardingCompleted: typeof body.onboardingCompleted === "boolean" ? body.onboardingCompleted : undefined,
      preferredCity: typeof body.preferredCity === "string" ? body.preferredCity : undefined,
      preferredNightlifeTypes: Array.isArray(body.preferredNightlifeTypes) ? body.preferredNightlifeTypes : undefined,
      ageRange: typeof body.ageRange === "string" ? body.ageRange : undefined,
    },
  });

  if (displayName) {
    await prisma.user.update({ where: { id: user.id }, data: { displayName } });
  }

  return NextResponse.json({ ok: true, handle: profile.handle });
}
