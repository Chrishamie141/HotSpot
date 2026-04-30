import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/social-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.socialPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      media: true,
      user: { include: { socialProfile: true } },
      likes: { where: { userId: user.id } },
      _count: { select: { comments: true } },
    },
    take: 50,
  });

  const stories = await prisma.socialStory.findMany({
    where: { expiresAt: { gt: new Date() } },
    include: { user: { include: { socialProfile: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({
    posts: posts.map((post) => ({
      id: post.id,
      username: `@${post.user.socialProfile?.handle ?? "user"}`,
      avatarUrl: post.user.socialProfile?.avatarUrl ?? "",
      venue: post.venueName ?? "",
      location: post.location ?? "",
      postedAt: post.createdAt.toISOString(),
      mediaUrl: post.media[0]?.mediaUrl ?? "",
      mediaType: post.media[0]?.mediaType === "video" ? "video" : "image",
      thumbnailUrl: post.media[0]?.thumbnailUrl ?? undefined,
      caption: post.caption,
      vibeScore: post.vibeScore ?? 0,
      venueAverageVibe: post.vibeScore ?? 0,
      hearted: post.likes.length > 0,
      commentsCount: post._count.comments,
    })),
    stories: stories.map((story) => ({
      id: story.id,
      title: story.title ?? `@${story.user.socialProfile?.handle ?? "user"}`,
      subtitle: story.subtitle ?? "",
      avatarUrl: story.user.socialProfile?.avatarUrl ?? "",
      liveNow: true,
      type: "user" as const,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  const created = await prisma.socialPost.create({
    data: {
      userId: user.id,
      venueName: body.venue || null,
      location: body.location || "Newark, NJ",
      caption: body.caption || "",
      vibeScore: body.vibeScore || null,
      media: body.mediaUrl
        ? {
            create: {
              mediaUrl: body.mediaUrl,
              mediaType: body.mediaType === "video" ? "video" : "image",
              thumbnailUrl: body.thumbnailUrl || null,
            },
          }
        : undefined,
    },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
