/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@andypf/json-viewer", "@json-editor/json-editor"],
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
