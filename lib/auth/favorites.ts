import { randomUUID } from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/data/json-store";
import { UserFavorite } from "@/lib/auth/types";

const FAVORITES_FILE = "favorites.json";

export async function listFavorites() {
  return readJsonFile<UserFavorite[]>(FAVORITES_FILE, []);
}

export async function listFavoritesForUser(userId: string) {
  const favorites = await listFavorites();
  return favorites.filter((item) => item.userId === userId);
}

export async function isFavoriteForUser(userId: string, venueId: string) {
  const favorites = await listFavorites();
  return favorites.some((item) => item.userId === userId && item.venueId === venueId);
}

export async function toggleFavoriteForUser(input: Omit<UserFavorite, "id" | "createdAt">) {
  const favorites = await listFavorites();
  const existing = favorites.find(
    (item) => item.userId === input.userId && item.venueId === input.venueId
  );

  if (existing) {
    const next = favorites.filter((item) => item.id !== existing.id);
    await writeJsonFile(FAVORITES_FILE, next);
    return { saved: false };
  }

  const next: UserFavorite = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await writeJsonFile(FAVORITES_FILE, [next, ...favorites]);
  return { saved: true, favorite: next };
}
