/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com', // Product images are still hosted on FakeStore API
      },
    ],
  },
};

export default nextConfig;
