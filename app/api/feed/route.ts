import { NextRequest, NextResponse } from "next/server";
import { createPost, listPosts } from "@/lib/auth/posts";
import { findUserById } from "@/lib/auth/users";
import { requireAuth } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAuth();
    const posts = await listPosts();

    const hydrated = await Promise.all(
      posts.map(async (post) => {
        const user = await findUserById(post.userId);
        return {
          ...post,
          user: user
            ? {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ posts: hydrated });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    if (!body.caption || !body.venueName) {
      return NextResponse.json({ error: "Caption and venue are required." }, { status: 400 });
    }

    const post = await createPost({
      userId: user.id,
      venueName: String(body.venueName),
      locationTag: String(body.locationTag ?? ""),
      caption: String(body.caption),
      mediaUrl: String(body.mediaUrl ?? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"),
      mediaType: body.mediaType === "video" ? "video" : "image",
      vibeScore: Number(body.vibeScore ?? 7),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
