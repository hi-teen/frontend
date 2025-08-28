/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화 설정
  images: {
    domains: ['hiteen.site'],
    // 로컬 이미지 경로 설정
    unoptimized: false,
    // 정적 이미지 경로 설정
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // API 라우트 리라이팅
  async rewrites() {
    return [
      {
        source: '/api/schools/:path*',
        destination: 'https://hiteen.site/schools/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://hiteen.site/api/:path*',
      },
    ];
  },
  
  // 웹팩 설정
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 사이드에서 Node.js 모듈 사용 방지
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;