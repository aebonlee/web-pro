import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// 커스텀 도메인(bootcamp.dreamitbiz.com) 사용 → base는 '/'
// ANALYZE=1 일 때만 번들 사이즈 리포트(dist/stats.html) 생성
const analyze = !!process.env.ANALYZE

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    analyze && visualizer({ filename: 'dist/stats.html', template: 'treemap', gzipSize: true, brotliSize: true, open: false }),
  ].filter(Boolean),
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
