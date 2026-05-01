import PageHeader from "../../components/shared/PageHeader";
import CreatePost from "./components/CreatePost";
import FeedList from "./components/FeedList";

const featuredPost = {
  id: "clara-featured",
  name: "CLARA",
  badge: "Founder",
  content:
    "Before you spend today, ask yourself: is this planned, needed, or emotional?",
  tag: "#AskBeforeYouAct",
  isFeatured: true,
};

const posts = [
  {
    id: "post-1",
    name: "Mika",
    badge: "Core",
    content:
      "I delayed buying something today and realized I only wanted it because I was stressed.",
    tag: "#MoneyReflection",
  },
  {
    id: "post-2",
    name: "Jem",
    badge: "Pro",
    content:
      "Small win: I checked my budget before ordering food. Still bought it, but at least it was planned.",
    tag: "#BudgetWin",
  },
];

export default function Feed() {
  const feedPosts = [featuredPost, ...posts];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Feed"
        subtitle="Learn, reflect, and grow your financial habits"
      />

      <CreatePost />

      <FeedList posts={feedPosts} />
    </div>
  );
}
