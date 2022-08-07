/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["dweb.link","*.jpeg"],
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true }};
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true 
    return config;
  },

}

module.exports = nextConfig
