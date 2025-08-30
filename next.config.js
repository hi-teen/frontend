/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화 설정
  images: {
    domains: ['hiteen.site'],
    // 로컬 이미지 허용
    unoptimized: true,
    // 필요 시에만 명시; 기본값 inline 유지
    contentDispositionType: 'inline',
    // SVG가 꼭 필요 없다면 비활성화 권장
    // dangerouslyAllowSVG: false,
    // SVG 활성 시 CSP는 유지해 공격면 최소화
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