import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/predict":        "http://localhost:5000",
      "/predict-survey": "http://localhost:5000",
      "/health":         "http://localhost:5000",
      "/features":       "http://localhost:5000",
    },
  },
});
 