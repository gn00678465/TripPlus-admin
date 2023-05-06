/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    BASE_API_URL: process.env.BASE_API_URL
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: process.env.REDIRECT_INDEX,
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
