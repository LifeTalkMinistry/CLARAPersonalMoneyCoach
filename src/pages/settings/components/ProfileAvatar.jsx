import { useRef, useState } from "react";

export default function ProfileAvatar() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);

  const handlePick = () => {
    fileRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return (
    <div className="flex items-center gap-4">

      {/* AVATAR */}
      <div
        onClick={handlePick}
        className="relative h-16 w-16 cursor-pointer rounded-2xl border border-white/15 bg-white/10 overflow-hidden group transition"
      >
        {image ? (
          <img
            src={image}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white/80">
            JM
          </div>
        )}

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-semibold tracking-wide transition">
          Change
        </div>
      </div>

      {/* INFO */}
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-white">
          Jerome Mirabuenos
        </h2>
        <p className="text-xs text-white/50">
          View and edit profile
        </p>
      </div>

      {/* HIDDEN INPUT */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
