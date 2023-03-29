/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placekitten.com']
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/round/1',
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig
