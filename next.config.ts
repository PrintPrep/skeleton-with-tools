import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Optimize for PDF processing
    experimental: {
        serverActions: {
            bodySizeLimit: "50mb",
        },
    },

    // Webpack config for PDF.js worker
    webpack: (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            canvas: false,
            encoding: false,
        };
        return config;
    },
};

export default nextConfig;
