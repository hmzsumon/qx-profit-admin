// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,

  // Tree-shake heavy barrel imports so mobile bundles stay small.
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/x-data-grid",
      "recharts",
      "lucide-react",
      "framer-motion",
    ],
  },

  // ── keep your Sass & rewrites ──────────────────────────────
  sassOptions: {
    additionalData: `$var: red;`,
  },
  // Same-origin API proxy. RTK Query calls /api/v1/* (see config/baseUrl.ts) so
  // the session cookie is set first-party on the admin domain — required for
  // middleware.ts to see it. Do not point the browser at the API host directly.
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          "https://qx-profit-api-bff66bb8112c.herokuapp.com/api/v1/:path*",
      },
    ];
  },

  // ── enable SVGR so .svg can be imported as React components ─
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                // remove hard-coded fill/stroke so color can be controlled via CSS currentColor
                { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
