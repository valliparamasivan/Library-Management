/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.NEXT_APP_BASE_URL,
    S3_URL: process.env.NEXT_APP_S3_URL,
  },
  images: {
    unoptimized: true,
    remotePatterns: process.env.NEXT_APP_S3_URL
      ? [
          {
            protocol: "https",
            hostname: process.env.NEXT_APP_S3_URL.replace(/^https?:\/\//, "").split("/")[0],
          },
        ]
      : [],
  },
};

export default nextConfig;
