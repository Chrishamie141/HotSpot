"use client";

import { useEffect, useState } from "react";
import { EditProfileFlow } from "@/components/profile/edit-profile-flow";
import { profileHighlights, profileSettings } from "@/components/profile/mock-profile-data";
import type { FeedPost } from "@/components/feed/types";
import { ProfileActionBar } from "@/components/profile/profile-action-bar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileHighlights } from "@/components/profile/profile-highlights";
import { ProfilePostGrid } from "@/components/profile/profile-post-grid";
import { ProfileSettingsScreen } from "@/components/profile/profile-settings-screen";
import { ShareProfileSheet } from "@/components/profile/share-profile-sheet";
import { ProfileStats } from "@/components/profile/profile-stats";

export function ProfilePageContent() {
  const [viewingOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerDelta, setFollowerDelta] = useState(0);
  const [activeTab, setActiveTab] = useState<"posts" | "tagged" | "saved">("posts");
  const [selectedHighlight, setSelectedHighlight] = useState<string>();
  const [openShare, setOpenShare] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [highlightMessage, setHighlightMessage] = useState("");
  const [currentProfile, setCurrentProfile] = useState({
    displayName: "User",
    username: "@user",
    bio: "",
    cityLine: "",
    avatarUrl: "",
    followers: 0,
    following: 0,
    isCurrentUser: true,
  });
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const profile = currentProfile;

  async function updateProfile(changes: Record<string, unknown>) {
    await fetch("/api/social/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(changes) });
    const data = await fetch("/api/social/profile").then((response) => response.json());
    setCurrentProfile((prev) => ({ ...prev, ...data.profile, isCurrentUser: true }));
    setPosts(data.posts ?? []);
  }

  useEffect(() => {
    fetch("/api/social/profile")
      .then((response) => response.json())
      .then((data) => {
        setCurrentProfile((prev) => ({ ...prev, ...data.profile, isCurrentUser: true }));
        setPosts(data.posts ?? []);
      });
  }, []);

  const followers = viewingOwnProfile ? profile.followers : profile.followers + followerDelta;

  return (
    <section className="space-y-4">
      <ProfileHeader
        displayName={profile.displayName}
        username={profile.username}
        bio={profile.bio}
        cityLine={profile.cityLine}
        avatarUrl={profile.avatarUrl}
      />

      <ProfileStats
        postCount={posts.length}
        followers={followers}
        following={profile.following}
      />

      <ProfileActionBar
        isCurrentUser
        isFollowing={isFollowing}
        onFollowToggle={() => {
          setIsFollowing((prev) => !prev);
          setFollowerDelta((prev) => (isFollowing ? prev - 1 : prev + 1));
        }}
        onShare={() => setOpenShare(true)}
        onEdit={() => setOpenEdit(true)}
        onSettings={() => setOpenSettings(true)}
      />

      <ProfileHighlights
        highlights={profileHighlights}
        selectedId={selectedHighlight}
        onSelect={(highlightId) => {
          setSelectedHighlight(highlightId);
          const highlight = profileHighlights.find((item) => item.id === highlightId);
          setHighlightMessage(highlight ? `${highlight.title} opened.` : "");
        }}
      />

      {highlightMessage ? <p className="text-xs text-cyan-200">{highlightMessage}</p> : null}

      <ProfilePostGrid posts={posts} taggedPosts={[]} savedPosts={[]} activeTab={activeTab} onTabChange={setActiveTab} />

      <ShareProfileSheet open={openShare} username={profile.username} onClose={() => setOpenShare(false)} />
      <EditProfileFlow
        open={openEdit}
        profile={profile}
        onClose={() => setOpenEdit(false)}
        onSave={async (changes) => {
          await updateProfile(changes);
        }}
      />
      <ProfileSettingsScreen
        open={openSettings}
        items={profileSettings}
        onClose={() => setOpenSettings(false)}
        onOpenAuth={() => {}}
        onOpenEdit={() => setOpenEdit(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setOpenSettings(false);
        }}
        profile={profile}
        onUpdateProfile={updateProfile}
        onLogout={async () => {
          await fetch("/api/social/logout", { method: "POST" });
          window.location.href = "/login";
        }}
      />
    </section>
  );
}
