const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atorix-backend-server.onrender.com'
      : 'http://https://atorix-backend-server.onrender.com',
    // Keep backward compatibility
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atorix-backend-server.onrender.com'
        : 'https://atorix-backend-server.onrender.com/api'), // From integrated file - includes /api suffix
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Split chunks for better caching
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
      },
    };

    return config;
  },
  images: {
    unoptimized: true, // This disables the Image Optimization API
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      // From integrated file - Allow all domains
      {
        protocol: 'https',
        hostname: '**', // Allow all domains
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Adjust any experimental features as needed
    serverActions: true, // From integrated file
  },
  // API proxy configuration (from integrated file)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://atorix-backend-server.onrender.com/api/:path*',
      },
    ];
  },
};

// Set port for development (from integrated file)
if (process.env.NODE_ENV === 'development') {
  process.env.PORT = '3000';
  process.env.HOST = '0.0.0.0';
}

module.exports = nextConfig;
