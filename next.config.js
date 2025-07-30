module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signup',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};
