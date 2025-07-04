module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://hiteen.site/api/:path*',
        },
      ];
    },
  };
  