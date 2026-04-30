import { useAvatar } from "../../context/AvatarContext";

export default function Avatar({ size = 48, className = "" }) {
  const { avatar, avatarInitials } = useAvatar();

  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-white font-semibold ${className}`}
    >
      {avatar.image ? (
        <img
          src={avatar.image}
          alt="avatar"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm">{avatarInitials}</span>
      )}
    </div>
  );
}
