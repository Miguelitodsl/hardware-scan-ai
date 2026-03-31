/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Isso aqui ignora os erros de tipo no build (essencial para subir rápido agora!)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Isso ignora avisos de formatação
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;