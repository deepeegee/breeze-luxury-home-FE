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
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
