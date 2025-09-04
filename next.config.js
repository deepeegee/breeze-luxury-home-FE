/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    quietDeps: true,
    silenceDeprecations: [
      "mixed-decls",
      "legacy-js-api",
      "import",
      "slash-div",
      "global-builtin",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-d91e6aff4c8e45928248ccffab955f9a.r2.dev",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
  webpack(config) {
    // ✅ SVGR for importing .svg as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  async rewrites() {
    return [
      // Proxy API to your backend
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
      },

      // ✅ Pretty property URLs:
      //    /property/<slug>  → serves your existing /single-v3/[id] page
      //    The page code we added handles both ids and slugs.
      {
        source: "/property/:slug",
        destination: "/single-v3/:slug",
      },

      // 🔜 (Later) Blog pretty URLs:
      // Uncomment/adjust once you wire up blog detail to accept slugs
      // {
      //   source: "/blog/:slug",
      //   destination: "/blog-list-v3/:slug",
      // },
    ];
  },
};

module.exports = nextConfig;
