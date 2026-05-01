import { useState } from "react";
import ClaraPageShell from "../components/shared/layout/ClaraPageShell";
import CreatePost from "./feed/components/CreatePost";
import FeedList from "./feed/components/FeedList";
import PostComposerModal from "./feed/components/PostComposerModal";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Insight");

  const handleSubmit = () => {
    const newPost = {
      id: Date.now(),
      name: "You",
      content,
      category,
    };

    setPosts([newPost, ...posts]);
    setContent("");
    setCategory("Insight");
    setOpen(false);
  };

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

        <CreatePost onOpen={() => setOpen(true)} />

        <FeedList posts={posts} />
      </div>

      <PostComposerModal
        open={open}
        content={content}
        selectedCategory={category}
        onClose={() => setOpen(false)}
        onContentChange={setContent}
        onCategoryChange={setCategory}
        onSubmit={handleSubmit}
      />
    </ClaraPageShell>
  );
}
