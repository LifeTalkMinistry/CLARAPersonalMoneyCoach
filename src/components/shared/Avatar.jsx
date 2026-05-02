import { useAvatar } from "../../context/AvatarContext";

export default function Avatar({ size = 48, className = "" }) {
  const { avatar, avatarInitials } = useAvatar();

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-2xl border font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: "var(--clara-border)",
        background: "var(--clara-glass)",
        color: "var(--clara-text)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.18)",
      }}
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
