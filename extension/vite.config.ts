import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

// Template only — untouched since scaffolding. Bundles the MV3 extension
// (popup + options + background service worker) from manifest.json.
export default defineConfig({
  plugins: [crx({ manifest })],
});
