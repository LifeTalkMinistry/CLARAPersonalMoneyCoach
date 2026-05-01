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
  const [originRect, setOriginRect] = useState(null);

  const handleOpen = (e) => {
    setOriginRect(e.currentTarget.getBoundingClientRect());
    setOpen(true);
  };

  const handleSubmit = () => {
    const newPost = { id: Date.now(), name: "You", content, category };
    setPosts([newPost, ...posts]);
    setContent("");
    setCategory("Insight");
    setOpen(false);
  };

  return (
    <ClaraPageShell>
      <div className="space-y-4 pb-[calc(70px+env(safe-area-inset-bottom))] sm:pb-[calc(88px+env(safe-area-inset-bottom))]">
        <header className="pt-1">
          <h1 className="text-xl font-semibold tracking-tight text-white/90">Feed</h1>
        </header>

        <CreatePost onOpen={handleOpen} />

        <FeedList posts={posts} />
      </div>

      <PostComposerModal
        open={open}
        originRect={originRect}
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
