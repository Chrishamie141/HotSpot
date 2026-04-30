import type { FeedPost } from "@/components/feed/types";
import { mockFeedPosts } from "@/components/feed/mock-feed-data";

export type ProfileIdentity = {
  displayName: string;
  username: string;
  bio: string;
  cityLine: string;
  avatarUrl: string;
  followers: number;
  following: number;
  isCurrentUser: boolean;
};

export const currentUserProfile: ProfileIdentity = {
  displayName: "Chris Vale",
  username: "@you",
  bio: "Chasing rooftop sets, late-night lounges, and the city’s best after-hours energy.",
  cityLine: "Newark nights · House + Afrobeat",
  avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  followers: 24800,
  following: 612,
  isCurrentUser: true,
};

export const visitingProfile: ProfileIdentity = {
  displayName: "Mira Lane",
  username: "@mira.nights",
  bio: "Venue scout. Crowd reporter. Posting the real vibe in real time.",
  cityLine: "Downtown circuit · Tech house",
  avatarUrl: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=400&q=80",
  followers: 11240,
  following: 384,
  isCurrentUser: false,
};

export const profileHighlights = [
  { id: "highlight-1", title: "Rooftops", coverUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80" },
  { id: "highlight-2", title: "DJ Nights", coverUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=300&q=80" },
  { id: "highlight-3", title: "Lounges", coverUrl: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&w=300&q=80" },
  { id: "highlight-4", title: "Crew", coverUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80" },
];

const seededCurrentUserPosts: FeedPost[] = [
  {
    id: "profile-post-1",
    username: "@you",
    avatarUrl: currentUserProfile.avatarUrl,
    venue: "Pulse Social Club",
    location: "Downtown Newark",
    postedAt: "1h",
    mediaUrl: "https://images.unsplash.com/photo-1571266028243-d220c9d6b084?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    caption: "Peak hour energy upstairs.",
    vibeScore: 8,
    venueAverageVibe: 7.7,
    commentsCount: 9,
    hearted: true,
  },
  {
    id: "profile-post-2",
    username: "@you",
    avatarUrl: currentUserProfile.avatarUrl,
    venue: "Afterglow Lounge",
    location: "Ironbound",
    postedAt: "3d",
    mediaUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    caption: "Low lights, tight crowd, perfect warmup set.",
    vibeScore: 7,
    venueAverageVibe: 7.1,
    commentsCount: 4,
  },
];

export const profilePostsCurrentUser: FeedPost[] = [...seededCurrentUserPosts, ...mockFeedPosts.filter((post) => post.username === "@you")];
export const profilePostsVisitingUser: FeedPost[] = mockFeedPosts.filter((post) => post.username === "@mira.nights");

export const taggedPosts: FeedPost[] = mockFeedPosts;
export const savedPosts: FeedPost[] = [...mockFeedPosts].reverse();

export const profileSettings = [
  "Edit profile",
  "Account settings",
  "Privacy",
  "Notifications",
  "Saved posts",
  "Tagged posts",
  "Content preferences",
  "Nightlife preferences",
  "Help & support",
  "Log out",
];
