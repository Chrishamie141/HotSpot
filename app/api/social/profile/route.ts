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
