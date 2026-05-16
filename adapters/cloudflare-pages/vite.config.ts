import { cloudflarePagesAdapter } from '@builder.io/qwik-city/adapters/cloudflare-pages/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import baseConfig from '../../vite.config';

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.cloudflare-pages.tsx', '@qwik-city-plan'],
      },
    },
    plugins: [
      cloudflarePagesAdapter({
        ssg: {
          include: ['/*'], // Pre-render all pages into static HTML to be served from edge nodes
          origin: 'https://ecommerce-blueprint.local',
        },
      }),
    ],
  };
});