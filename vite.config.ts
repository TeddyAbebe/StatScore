import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Target modern browsers — prevents esbuild from warning about CSS
    // features like @property (used by DaisyUI's radial-progress).
    cssTarget: ["chrome87", "firefox78", "safari14", "edge88"],

    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks so the main
        // bundle stays small and browsers can cache each chunk independently.
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // UI icon libraries (large)
          "vendor-icons": ["lucide-react", "react-icons"],
          // Date utilities
          "vendor-date": ["date-fns", "react-datepicker"],
          // Flag component
          "vendor-flags": ["react-world-flags"],
        },
      },
    },

    // Raise the warning threshold slightly so minor overages don't warn
    chunkSizeWarningLimit: 600,
  },
});
