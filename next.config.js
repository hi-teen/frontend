module.exports = {
  async rewrites() {
    return [
      // 1) schools 검색만 /schools 로 보내기
      {
        source: '/api/schools/:path*',
        destination: 'https://hiteen.site/schools/:path*',
      },
      // 2) 그 외 /api/... 은 그대로 /api/... 로 보내기
      {
        source: '/api/:path*',
        destination: 'https://hiteen.site/api/:path*',
      },
    ];
  },
};
