// next.config.js
module.exports = {
  async redirects() {
    return [
      { source: '/', destination: '/signup', permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://hiteen.site/api/v1/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://hiteen.site/api/:path*',
      },
    ];
  },
};
