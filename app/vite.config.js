import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Served at mi-cole-one.vercel.app/demo/ (PRD decision 2). `npm run build:site` writes it into the site folder Vercel serves.
export default defineConfig({ base: "/demo/", plugins: [react()] });
