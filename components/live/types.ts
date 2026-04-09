export type VibeLevelLabel = "Chill" | "Calm" | "Active" | "Lit" | "Crazy";

export type LiveFeedPost = {
  id: string;
  username: string;
  avatarUrl: string;
  venue: string;
  location: string;
  postedAt: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  vibeScore: number;
  hearted?: boolean;
  commentsCount: number;
  venueAverageVibe: number;
};
