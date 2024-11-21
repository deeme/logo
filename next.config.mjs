/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'], // 允许所有域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
      {
        protocol: 'http',
        hostname: '*',
      }
    ],
    unoptimized: false, // 启用图片优化
  },
  
  // 性能和安全配置
  poweredByHeader: false, // 禁用 X-Powered-By 头
  reactStrictMode: true, // 启用 React 严格模式
  
  // 跨域配置（如需要）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;