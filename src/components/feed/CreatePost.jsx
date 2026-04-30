import { useState } from "react";

export default function CreatePost({ onCreate }) {
  const [text, setText] = useState("");

  function handlePost() {
    if (!text.trim()) return;

    onCreate(text);
    setText("");
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share something..."
        className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder:text-white/40"
        rows={3}
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={handlePost}
          className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
        >
          Post
        </button>
      </div>
    </div>
  );
}