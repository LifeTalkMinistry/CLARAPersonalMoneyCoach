import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import CreatePost from "./feed/components/CreatePost";
import FeedList from "./feed/components/FeedList";

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
    <ClaraPageShell>
      <div className="space-y-5 pb-[calc(70px+env(safe-area-inset-bottom))] sm:pb-[calc(88px+env(safe-area-inset-bottom))]">
        <header className="pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Financial reflection
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Feed
          </h1>

          <p className="mt-1 max-w-[320px] text-sm leading-6 text-white/50">
            Learn, reflect, and grow your financial habits with calm intention.
          </p>
        </header>

        <CreatePost />

        <FeedList posts={feedPosts} />
      </div>
    </ClaraPageShell>
  );
}
