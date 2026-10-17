import { spawnSync } from 'node:child_process'
import path from 'node:path'

// The yacht page used to read public/ at runtime. That traced every photo
// into the serverless function and blew past Vercel's 250 MB limit.
// Refresh the filename list before the build bundles it.
const manifest = spawnSync(
  process.execPath,
  [path.join(process.cwd(), 'scripts', 'write-fleet-manifest.mjs')],
  { stdio: 'inherit' },
)
if (manifest.status !== 0) {
  throw new Error('No se pudo generar lib/fleet-manifest.json')
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jzaldlodozcpdevmplco.supabase.co', // Tu ID de proyecto específico
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  outputFileTracingExcludes: {
    '*': ['public/**/*'],
    '**': ['public/**/*'],
    '**/*': ['public/**/*'],
  },
};

export default nextConfig;