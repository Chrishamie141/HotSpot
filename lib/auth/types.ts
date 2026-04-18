export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  password: string;
  bio: string;
  avatarUrl: string;
  hometown?: string;
  favoriteVibe?: string;
  createdAt: string;
  privacyEnabled: boolean;
  notificationsEnabled: boolean;
  contentPreferencesEnabled: boolean;
  nightlifePreferences: string[];
  savedPostIds: string[];
  taggedPostIds: string[];
};

export type UserSession = {
  token: string;
  userId: string;
  createdAt: string;
};

export type UserPost = {
  id: string;
  userId: string;
  venueName: string;
  locationTag: string;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  vibeScore: number;
  createdAt: string;
};

export type UserFavorite = {
  id: string;
  userId: string;
  venueId: string;
  name: string;
  address: string;
  type: "restaurant" | "bar" | "club" | "lounge" | "other";
  rating: number | null;
  photoUrl?: string | null;
  lat?: number;
  lng?: number;
  createdAt: string;
};
