import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 全部 /api 走 Nitro mock；App 用户列表由 mock 转发 linjing-backend
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
