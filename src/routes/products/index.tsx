import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

// The default export automatically handles the GET request and serves HTML.
export default component$(() => {
  return (
    <main class="ui container">
      <h1 class="ui dividing header">Product Catalog</h1>
      <div class="ui stackable grid">
        {/* Product Cards go here. Qwikloader bootstrap hooks are automatically 
            injected by the Qwik City optimizer during the SSG build. */}
      </div>
    </main>
  );
});

// Optional: Define AEO/SEO metadata for this specific route
export const head: DocumentHead = {
  title: 'Product Catalog | Our Store',
  meta: [
    {
      name: 'description',
      content: 'Browse our complete catalog of edge-delivered products.',
    },
  ],
};