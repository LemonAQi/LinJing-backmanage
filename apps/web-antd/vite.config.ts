import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          // Uni 登录用户列表走 linjing-backend（默认 8000）
          '/api/admin': {
            changeOrigin: true,
            target: process.env.LINJING_API_TARGET || 'http://127.0.0.1:8000',
          },
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址（后台账号登录仍走 Vben Nitro mock）
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
