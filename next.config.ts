import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Optimize for PDF processing
    experimental: {
        serverActions: {
            bodySizeLimit: "100mb",
        },
    },

    // Empty turbopack config to silence the warning
    turbopack: {},

    // Webpack config for fallback (if someone uses --webpack flag)
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