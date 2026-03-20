/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lorcast.com",
      },
      {
        protocol: "https",
        hostname: "**.lorcast.com",
      },
      {
        protocol: "https",
        hostname: "lorcast.io",
      },
      {
        protocol: "https",
        hostname: "**.lorcast.io",
      },
      {
        protocol: "https",
        hostname: "cards.lorcast.io",
      },
      {
        protocol: "https",
        hostname: "api.lorcast.com",
      },
    ],
  },
};

module.exports = nextConfig;
