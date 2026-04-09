import { AppShell } from "@/components/app-shell";
import { ProfilePageContent } from "@/components/profile/profile-page-content";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" locationLabel="Newark, NJ">
      <ProfilePageContent />
    </AppShell>
  );
}
