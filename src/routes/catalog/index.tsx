import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { fetchGitHubCmsData, decodeGitHubContent, type ProductSchema } from '../../utils/github-cms';
import { ProductCard } from '../../components/product-card/product-card';

/**
 * Injecting Async Computations with the routeLoader$ Lifecycle[cite: 3].
 * The agent executes this before component rendering to fetch external data.
 */
export const useCatalogLoader = routeLoader$<ProductSchema[]>(async ({ env, error }) => {
  try {
    // Fetching the directory tree from the Headless Git CMS[cite: 3].
    const files = await fetchGitHubCmsData('content/products', env);
    
    // Resolving individual product payloads at build-time[cite: 3].
    const products = await Promise.all(
      files.map(async (file: { name: string }) => {
        const fileData = await fetchGitHubCmsData(`content/products/${file.name}`, env);
        const rawJson = decodeGitHubContent(fileData.content);
        return JSON.parse(rawJson) as ProductSchema;
      })
    );
    
    return products;
  } catch (e) {
    throw error(500, 'Edge Data Resolution Failed');
  }
});

// The framework downloads components only upon render, enforcing progressivity[cite: 2].
export default component$(() => {
  const catalogSignal = useCatalogLoader();

  return (
    // Clean Signaling: Replacing Legacy Class Clutter with Human-Readable Semantic Layouts[cite: 3].
    <main class="ui container padded segment">
      <h1 class="ui header huge">Product Catalog</h1>
      <p class="ui sub header">Zero-Hydration Edge Commerce</p>
      
      <div class="ui divider"></div>
      
      <div class="ui three stackable cards">
        {catalogSignal.value.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Catalog | Decentralized Edge Commerce',
};