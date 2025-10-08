/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    trailingSlash: true,
    distDir: "buildedToS3",
    images: {
        unoptimized: true,
    },
    images: { unoptimized: true }
};

export default nextConfig;
