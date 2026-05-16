import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the root to avoid Next.js scanning the entire home directory
  // which causes significant slowdown on Windows.
  outputFileTracingRoot: __dirname,
  
  // Experimental optimizations for faster dev cycles
  experimental: {
    // Increase memory limit for the dev server if needed
    // (though we can't do it here, we can set it in scripts)
  },
  
  // Suppress the workspace root warning
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
