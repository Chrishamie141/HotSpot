"use client";

import { useMemo, useState } from "react";
import { AuthModal } from "@/components/profile/auth-modal";
import { EditProfileFlow } from "@/components/profile/edit-profile-flow";
import { currentUserProfile, profileHighlights, profilePostsCurrentUser, profilePostsVisitingUser, profileSettings, savedPosts, taggedPosts, visitingProfile } from "@/components/profile/mock-profile-data";
import { ProfileActionBar } from "@/components/profile/profile-action-bar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileHighlights } from "@/components/profile/profile-highlights";
import { ProfilePostGrid } from "@/components/profile/profile-post-grid";
import { ProfileSettingsScreen } from "@/components/profile/profile-settings-screen";
import { ShareProfileSheet } from "@/components/profile/share-profile-sheet";
import { ProfileStats } from "@/components/profile/profile-stats";

export function ProfilePageContent() {
  const [viewingOwnProfile, setViewingOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerDelta, setFollowerDelta] = useState(0);
  const [activeTab, setActiveTab] = useState<"posts" | "tagged" | "saved">("posts");
  const [selectedHighlight, setSelectedHighlight] = useState<string>();
  const [openShare, setOpenShare] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [highlightMessage, setHighlightMessage] = useState("");
  const [currentProfile, setCurrentProfile] = useState(currentUserProfile);

  const profile = viewingOwnProfile ? currentProfile : visitingProfile;

  const posts = useMemo(() => (viewingOwnProfile ? profilePostsCurrentUser : profilePostsVisitingUser), [viewingOwnProfile]);

  const followers = viewingOwnProfile ? profile.followers : profile.followers + followerDelta;

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setViewingOwnProfile((x) => !x);
            setFollowerDelta(0);
            setIsFollowing(false);
          }}
          className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-200"
        >
          {viewingOwnProfile ? "View as visitor" : "View as you"}
        </button>
      </div>

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
        isCurrentUser={viewingOwnProfile}
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

      <ProfilePostGrid
        posts={posts}
        taggedPosts={taggedPosts}
        savedPosts={savedPosts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ShareProfileSheet open={openShare} username={profile.username} onClose={() => setOpenShare(false)} />
      <EditProfileFlow
        open={openEdit}
        profile={profile}
        onClose={() => setOpenEdit(false)}
        onSave={(changes) => setCurrentProfile((prev) => ({ ...prev, ...changes }))}
      />
      <ProfileSettingsScreen
        open={openSettings}
        items={profileSettings}
        onClose={() => setOpenSettings(false)}
        onOpenAuth={() => setOpenAuth(true)}
        onOpenEdit={() => setOpenEdit(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setOpenSettings(false);
        }}
      />
      <AuthModal
        open={openAuth}
        onClose={() => setOpenAuth(false)}
        onUsernameCommitted={(username) => setCurrentProfile((prev) => ({ ...prev, username }))}
      />
    </section>
  );
}
