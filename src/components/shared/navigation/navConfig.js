import { Home, Rss, MessageCircle, Settings } from "lucide-react";

export const topNavItems = [
  {
    label: "Home",
    path: "/",
    icon: Home,
    badge: null,
  },
  {
    label: "Feed",
    path: "/feed",
    icon: Rss,
    badge: "dot",
  },
  {
    label: "Message",
    path: "/messages",
    icon: MessageCircle,
    badge: null,
  },
  {
    label: "Setting",
    path: "/settings",
    icon: Settings,
    badge: null,
  },
];