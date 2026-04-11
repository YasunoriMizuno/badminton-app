import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // 親ディレクトリに package-lock があると誤検出されるのを防ぐ
    root: __dirname,
  },
  typescript: {
    // ビルド時の型チェックをスキップ（Vercelのタイムアウト対策）
    ignoreBuildErrors: true,
  },
}

export default nextConfig
