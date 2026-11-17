import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Served at mi-cole-one.vercel.app/demo/ (PRD decision 2).
export default defineConfig({ base: "/demo/", plugins: [react()] });
