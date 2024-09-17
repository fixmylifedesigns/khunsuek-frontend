/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["files.stripe.com", "cf.bstatic.com"],
  },
};

export default nextConfig;
