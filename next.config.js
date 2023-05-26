/** @type {import('next').NextConfig} */

// const runtimeCaching = require('next-pwa/cache')
// runtimeCaching[0].handler = 'StaleWhileRevalidate'

const withPWA = require('next-pwa')({
  dest: 'public',
  // importScripts: ['/service-worker.js'],
  register: true,
  skipWaiting: true
  // register: true,
  // runtimeCaching,
  // skipWaiting: true
})
const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['dweb.link', '*.jpeg', 'firebasestorage.googleapis.com']
  },
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } }
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config
  }
})

module.exports = nextConfig
