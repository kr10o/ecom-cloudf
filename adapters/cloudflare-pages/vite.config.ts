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
          // Pre-render the entire application at build time[cite: 3]
          include: ['/*'], 
          // Set the origin to match the production domain
          origin: 'https://ecommerce-edge.example.com',
          // Optionally define a sitemap
          sitemapOutFile: 'sitemap.xml',
        },
      }),
    ],
  };
});