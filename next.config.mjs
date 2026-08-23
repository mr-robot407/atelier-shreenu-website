/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Bake server-side env vars into the bundle at build time.
  // Amplify's managed Lambda doesn't inject runtime env vars, so we embed
  // them from CodeBuild (where Amplify Console vars are available) instead.
  env: {
    BLOG_REGION: process.env.BLOG_REGION ?? "ap-south-1",
    BLOG_ACCESS_KEY_ID: process.env.BLOG_ACCESS_KEY_ID ?? "",
    BLOG_SECRET_ACCESS_KEY: process.env.BLOG_SECRET_ACCESS_KEY ?? "",
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME ?? "atelier-shreenu-blog-posts",
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? "atelier-shreenu-blog-images",
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL ?? "https://d3j5o298uybf9b.cloudfront.net",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "d3j5o298uybf9b.cloudfront.net",
      },
    ],
  },
  
  reactStrictMode: true,
  trailingSlash: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;