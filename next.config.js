module.exports = {
  async rewrites() {
    return [
      // 1) schools 검색을 /api/v1/schools로 보내기
      {
        source: '/api/v1/schools/:path*',
        destination: 'https://hiteen.site/api/v1/schools/:path*',
      },
      // 2) 그 외 /api/... 은 그대로 /api/... 로 보내기
      {
        source: '/api/:path*',
        destination: 'https://hiteen.site/api/:path*',
      },
    ];
  },
};
