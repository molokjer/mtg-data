/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Si usas imágenes externas (como Scryfall), descomenta esto:
  // images: {
  //   domains: ['img.scryfall.com'],
  // },
}

module.exports = nextConfig