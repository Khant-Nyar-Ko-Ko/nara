import { defineConfig, loadEnv } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

// Bundles the MV3 extension (popup + options + background service worker)
// from manifest.json. host_permissions is derived from VITE_API_BASE_URL so
// the API origin the code calls is always the one Chrome lets it reach.
export default defineConfig(({ mode }) => {
  const apiBaseUrl = loadEnv(mode, process.cwd(), "VITE_").VITE_API_BASE_URL || "http://localhost:3000";
  const apiOrigin = new URL(apiBaseUrl).origin;
  return {
    plugins: [crx({ manifest: { ...manifest, host_permissions: [`${apiOrigin}/*`] } })],
  };
});
