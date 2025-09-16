/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Si usas imágenes grandes, desactiva LFS aquí
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'img.scryfall.com',
  //       pathname: '/**',
  //     },
  //   ],
  // },
}

module.exports = nextConfig