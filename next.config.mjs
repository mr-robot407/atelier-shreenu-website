/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;