import PostCard from "./PostCard";
import EmptyFeed from "./EmptyFeed";

export default function FeedList({ posts = [] }) {
  if (!posts.length) {
    return <EmptyFeed />;
  }

  return (
    <section className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}
