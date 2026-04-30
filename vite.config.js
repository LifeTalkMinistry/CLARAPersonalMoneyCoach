import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 🔥 IMPORTANT: This fixes blank white screen on GitHub Pages
  base: "/CLARAPersonalMoneyCoach/",
});
