import { AppShell } from "@/components/app-shell";
import { FeedPage } from "@/components/feed/feed-page";

export default function FeedRoutePage() {
  return (
    <AppShell title="Feed" locationLabel="Newark, NJ">
      <FeedPage />
    </AppShell>
  );
}
