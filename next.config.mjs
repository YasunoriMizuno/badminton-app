/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // ビルド時の型チェックをスキップ（Vercelのタイムアウト対策）
      ignoreBuildErrors: true,
    },
    eslint: {
      // ビルド時のESLintチェックをスキップ
      ignoreDuringBuilds: true,
    },
  }
  
  export default nextConfig