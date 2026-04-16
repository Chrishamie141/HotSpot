import { randomUUID } from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/data/json-store";
import { AppUser } from "@/lib/auth/types";

const USERS_FILE = "users.json";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80";

export async function listUsers() {
  return readJsonFile<AppUser[]>(USERS_FILE, []);
}

export async function findUserById(userId: string) {
  const users = await listUsers();
  return users.find((user) => user.id === userId) ?? null;
}

export async function findUserByLogin(login: string) {
  const users = await listUsers();
  const needle = login.trim().toLowerCase();
  return (
    users.find(
      (user) => user.email.toLowerCase() === needle || user.username.toLowerCase() === needle
    ) ?? null
  );
}

export async function createUser(input: {
  username: string;
  displayName: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bio?: string;
}) {
  const users = await listUsers();
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim();
  const password = input.password.trim();

  if (!username || !email || !displayName || !password) {
    return { error: "Username, display name, email, and password are required." as const };
  }

  if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    return { error: "Username is already taken." as const };
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { error: "Email is already in use." as const };
  }

  const nextUser: AppUser = {
    id: randomUUID(),
    username,
    displayName,
    email,
    password,
    bio: input.bio?.trim() || "Nightlife explorer.",
    avatarUrl: input.avatarUrl?.trim() || DEFAULT_AVATAR,
    createdAt: new Date().toISOString(),
  };

  await writeJsonFile(USERS_FILE, [nextUser, ...users]);

  return { user: nextUser };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<AppUser, "displayName" | "bio" | "avatarUrl" | "username">>
) {
  const users = await listUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index < 0) return { error: "User not found." as const };

  const nextUsername = updates.username?.trim();
  if (nextUsername) {
    const duplicate = users.some(
      (user) => user.id !== userId && user.username.toLowerCase() === nextUsername.toLowerCase()
    );
    if (duplicate) return { error: "Username is already taken." as const };
    users[index].username = nextUsername;
  }

  if (typeof updates.displayName === "string") users[index].displayName = updates.displayName.trim() || users[index].displayName;
  if (typeof updates.bio === "string") users[index].bio = updates.bio.trim();
  if (typeof updates.avatarUrl === "string") users[index].avatarUrl = updates.avatarUrl.trim() || users[index].avatarUrl;

  await writeJsonFile(USERS_FILE, users);
  return { user: users[index] };
}
