import os from 'node:os'

function getLocalDevOrigins() {
  const origins = new Set(['localhost', '127.0.0.1', '192.168.85.118'])
  const interfaces = os.networkInterfaces()

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries ?? []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        origins.add(entry.address)
      }
    }
  }

  return Array.from(origins)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: getLocalDevOrigins(),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
