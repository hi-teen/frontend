module.exports = {
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
}