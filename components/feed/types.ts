export type FeedVibeLabel = "Chill" | "Calm" | "Active" | "Lit" | "Crazy";

export type FeedPost = {
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
  venueAverageVibe: number;
  hearted?: boolean;
  commentsCount: number;
};

export type FeedStory = {
  id: string;
  title: string;
  subtitle: string;
  avatarUrl: string;
  liveNow?: boolean;
  type: "venue" | "user";
};
