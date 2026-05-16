import type { RequestHandler } from '@builder.io/qwik-city';

// The 'onGet' export explicitly binds this logic to HTTP GET requests.
export const onGet: RequestHandler = async ({ json, headers }) => {
  // 1. Enforce strict caching at the Cloudflare Edge
  headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');

  // 2. In a real SSG scenario, this data might be read from the filesystem 
  //    (if pulled from GitHub during build) or fetched from a KV store.
  const productData = [
    { id: '1', sku: 'ITEM-001', name: 'Edge Server', price: 99.99 },
    // ...
  ];

  // 3. Dispatch the raw JSON payload
  json(200, {
    status: 'success',
    data: productData,
  });
};

// If you needed to handle a POST request at this same URL, you would simply add:
// export const onPost: RequestHandler = async ({ request, json }) => { ... }