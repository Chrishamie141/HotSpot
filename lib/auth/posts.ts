import { randomUUID } from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/data/json-store";
import { UserPost } from "@/lib/auth/types";

const POSTS_FILE = "posts.json";

export async function listPosts() {
  return readJsonFile<UserPost[]>(POSTS_FILE, []);
}

export async function listPostsForUser(userId: string) {
  const posts = await listPosts();
  return posts.filter((post) => post.userId === userId);
}

export async function createPost(input: Omit<UserPost, "id" | "createdAt">) {
  const posts = await listPosts();
  const next: UserPost = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await writeJsonFile(POSTS_FILE, [next, ...posts]);
  return next;
}
