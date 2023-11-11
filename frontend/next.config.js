/** @type {import('next').NextConfig} */
const nextConfig = {
  // WalletConnect settings
  // If SWCMinify is flagged, it must be false in the next.config.js file
  // If you are using Wagmi, dynamic imports or supressHydrationWarning are recommended tro prevent Hydration mismatch errors
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        // pathname: '/account123/**',
      },
    ],
  },
};

module.exports = nextConfig;
