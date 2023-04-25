/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    BASE_URL: process.env.BASE_URL
  }
};

module.exports = nextConfig;
