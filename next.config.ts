import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "comicimages.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "comicimages.s3.eu-north-1.amazonaws.com",
      },

      {
        protocol: "https",
        hostname: "comicimages.s3.amazonaws.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "files.comics.org",
      },
    ],
  },
};

export default nextConfig;
