/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Only use rewrites in development when API_BASE_URL is not set
    // In production, use NEXT_PUBLIC_API_URL environment variable
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:8000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
