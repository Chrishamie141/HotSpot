import { FeedStoryBubble } from "@/components/feed/feed-story-bubble";
import type { FeedStory } from "@/components/feed/types";

type FeedStoriesProps = {
  stories: FeedStory[];
};

export function FeedStories({ stories }: FeedStoriesProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {stories.map((story) => (
          <FeedStoryBubble key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
