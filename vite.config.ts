// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deployment base path. Defaults to "/" (root domain, Lovable preview).
// For a GitHub Pages project site, build with BASE_PATH=/<repo>/ (see .github/workflows/deploy.yml).
const rawBase = process.env.BASE_PATH?.trim() || "/";
const base = `/${rawBase.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");

export default defineConfig({
  vite: { base },
  tanstackStart: {
    // Every page is prerendered to static HTML for GitHub Pages. Detail pages
    // (/project, /property, /news/post) are one page each that loads ?id= in the browser.
    pages: [
      "/",
      "/about",
      "/services",
      "/construction",
      "/real-estate",
      "/projects",
      "/project",
      "/property",
      "/gallery",
      "/media",
      "/team",
      "/news",
      "/news/post",
      "/careers",
      "/contact",
      "/quote",
      // Admin dashboard (noindex). Rendered as an empty shell; sign-in runs in the browser.
      "/admin",
      "/admin/login",
      "/admin/reset-password",
      "/admin/requests",
      "/admin/projects",
      "/admin/properties",
      "/admin/gallery",
      "/admin/team",
      "/admin/news",
      "/admin/careers",
      "/admin/settings",
      "/admin/staff",
    ].map((path) => ({ path })),
    prerender: { enabled: true, autoStaticPathsDiscovery: false, crawlLinks: false },
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
