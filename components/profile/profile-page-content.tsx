import { ProfileActionButtons } from "@/components/profile/profile-action-buttons";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileHighlights } from "@/components/profile/profile-highlights";
import { profileData, profileHighlights, profilePosts, profileSettings, savedPosts, taggedPosts } from "@/components/profile/mock-profile-data";
import { ProfilePostGrid } from "@/components/profile/profile-post-grid";
import { ProfileSettingsList } from "@/components/profile/profile-settings-list";
import { ProfileStats } from "@/components/profile/profile-stats";

export function ProfilePageContent() {
  return (
    <section className="space-y-4">
      <ProfileHeader
        displayName={profileData.displayName}
        username={profileData.username}
        bio={profileData.bio}
        cityLine={profileData.cityLine}
        avatarUrl={profileData.avatarUrl}
      />

      <ProfileStats
        postCount={profilePosts.length}
        followers={profileData.followers}
        following={profileData.following}
      />

      <ProfileActionButtons />
      <ProfileHighlights highlights={profileHighlights} />

      <ProfilePostGrid
        posts={profilePosts}
        taggedPosts={taggedPosts}
        savedPosts={savedPosts}
      />

      <ProfileSettingsList items={profileSettings} />
    </section>
  );
}
