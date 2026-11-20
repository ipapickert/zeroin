import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lucide-react@1.x ships a single barrel that re-exports ~2000 icons via a
  // namespace (`export { index as icons }`). That defeats tree-shaking, and on
  // first compile Turbopack (and Next's import optimizer) pulls the entire icon
  // set into the module graph, which exhausts all system memory.
  //
  // modularizeImports rewrites `import { Target } from "lucide-react"` at parse
  // time into a direct per-icon module import, so the barrel is never loaded.
  // Icons must be imported by their plain name (e.g. `Check`, not `CheckIcon`),
  // because the per-icon files are kebab-cased plain names (`check.mjs`).
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{ kebabCase member }}",
    },
  },
  // Hosted course instances run `next dev` behind a public subdomain. Next.js
  // blocks dev-only requests (live reload, dev assets) from origins it does
  // not know, so the subdomain is listed via ALLOWED_DEV_ORIGINS
  // (comma-separated hostnames). Unset locally, where localhost just works.
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",").filter(Boolean),
};

export default nextConfig;
