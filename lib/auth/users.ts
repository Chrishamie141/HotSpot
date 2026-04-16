import { randomUUID } from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/data/json-store";
import { AppUser } from "@/lib/auth/types";

const USERS_FILE = "users.json";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80";

function withUserDefaults(user: Partial<AppUser>): AppUser {
  return {
    id: String(user.id ?? randomUUID()),
    username: String(user.username ?? ""),
    displayName: String(user.displayName ?? ""),
    email: String(user.email ?? "").toLowerCase(),
    password: String(user.password ?? ""),
    bio: String(user.bio ?? "Nightlife explorer."),
    avatarUrl: String(user.avatarUrl ?? DEFAULT_AVATAR),
    hometown: user.hometown,
    favoriteVibe: user.favoriteVibe,
    createdAt: String(user.createdAt ?? new Date().toISOString()),
    privacyEnabled: Boolean(user.privacyEnabled ?? false),
    notificationsEnabled: Boolean(user.notificationsEnabled ?? true),
    contentPreferencesEnabled: Boolean(user.contentPreferencesEnabled ?? true),
    nightlifePreferences: Array.isArray(user.nightlifePreferences) ? user.nightlifePreferences : [],
    savedPostIds: Array.isArray(user.savedPostIds) ? user.savedPostIds : [],
    taggedPostIds: Array.isArray(user.taggedPostIds) ? user.taggedPostIds : [],
  };
}

export async function listUsers() {
  const users = await readJsonFile<Partial<AppUser>[]>(USERS_FILE, []);
  return users.map(withUserDefaults);
}

async function persistUsers(users: AppUser[]) {
  await writeJsonFile(USERS_FILE, users);
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

  const nextUser = withUserDefaults({
    id: randomUUID(),
    username,
    displayName,
    email,
    password,
    bio: input.bio?.trim() || "Nightlife explorer.",
    avatarUrl: input.avatarUrl?.trim() || DEFAULT_AVATAR,
    createdAt: new Date().toISOString(),
    privacyEnabled: false,
    notificationsEnabled: true,
    contentPreferencesEnabled: true,
    nightlifePreferences: ["bars", "clubs"],
    savedPostIds: [],
    taggedPostIds: [],
  });

  await persistUsers([nextUser, ...users]);

  return { user: nextUser };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<
    Pick<
      AppUser,
      | "displayName"
      | "bio"
      | "avatarUrl"
      | "username"
      | "privacyEnabled"
      | "notificationsEnabled"
      | "contentPreferencesEnabled"
      | "nightlifePreferences"
      | "password"
      | "savedPostIds"
      | "taggedPostIds"
    >
  >
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
  if (typeof updates.password === "string" && updates.password.trim()) users[index].password = updates.password.trim();

  if (typeof updates.privacyEnabled === "boolean") users[index].privacyEnabled = updates.privacyEnabled;
  if (typeof updates.notificationsEnabled === "boolean") users[index].notificationsEnabled = updates.notificationsEnabled;
  if (typeof updates.contentPreferencesEnabled === "boolean") users[index].contentPreferencesEnabled = updates.contentPreferencesEnabled;
  if (Array.isArray(updates.nightlifePreferences)) users[index].nightlifePreferences = updates.nightlifePreferences;
  if (Array.isArray(updates.savedPostIds)) users[index].savedPostIds = updates.savedPostIds;
  if (Array.isArray(updates.taggedPostIds)) users[index].taggedPostIds = updates.taggedPostIds;

  await persistUsers(users);
  return { user: users[index] };
}
