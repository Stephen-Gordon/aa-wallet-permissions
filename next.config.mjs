/** @type {import('next').NextConfig} */
// disable eslint and typescript errors during build
const nextConfig = {

    ignoreDuringBuilds: true,
    eslint: {
        ignoreDuringBuilds: true,
      },
      typescript: {
        ignoreBuildErrors: true,
      },

};

export default nextConfig;
