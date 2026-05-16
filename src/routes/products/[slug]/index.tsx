// src/routes/products/[slug]/index.tsx
import { component$ } from '@builder.io/qwik';
import { routeLoader$, type StaticGenerateHandler, type DocumentHead } from '@builder.io/qwik-city';
import { fetchGitHubCmsData, decodeGitHubContent, type ProductSchema } from '../../../utils/github-cms';

/**
 * Deep Dive into the Qwik City onStaticGenerate Engine[cite: 3].
 * This function extracts slugs and instructs the compiler to generate static files[cite: 3].
 */
export const onStaticGenerate: StaticGenerateHandler = async ({ env }) => {
  // Fetch the directory tree for products
  const files = await fetchGitHubCmsData('content/products', env);
  
  // Extract slugs (removing the .json extension)[cite: 3]
  const params = files.map((file: any) => ({
    slug: file.name.replace('.json', ''),
  }));

  return {
    params,
  };
};

/**
 * Injecting Async Computations with the routeLoader$ Lifecycle[cite: 3].
 * This fetches the specific JSON model for the product at build time[cite: 3].
 */
export const useProductLoader = routeLoader$<ProductSchema>(async (requestEvent) => {
  const { params, env, error } = requestEvent;
  
  try {
    const fileData = await fetchGitHubCmsData(`content/products/${params.slug}.json`, env);
    const rawJson = decodeGitHubContent(fileData.content);
    return JSON.parse(rawJson) as ProductSchema;
  } catch (e) {
    throw error(404, 'Product not found in immutable CMS.');
  }
});

// Implementing component$ Closures for Surgical UI Rendering[cite: 3]
export default component$(() => {
  const productSignal = useProductLoader();

  return (
    // Clean Signaling: Replacing Legacy Class Clutter with Human-Readable Semantic Layouts[cite: 3]
    <article class="ui container padded segment">
      <div class="ui two column stackable grid">
        <div class="column">
          <div class="ui fluid image placeholder">
            {/* Placeholder for product imagery */}
          </div>
        </div>
        <div class="column">
          <h1 class="ui header huge">{productSignal.value.name}</h1>
          <p class="ui text large">{productSignal.value.description}</p>
          
          <div class="ui divider"></div>
          
          <h2 class="ui header green">
            {productSignal.value.currency} {productSignal.value.price.toFixed(2)}
          </h2>
          
          {productSignal.value.inStock ? (
            <button class="ui primary large button item_add">
              <i class="cart plus icon"></i>
              Add to Basket
            </button>
          ) : (
            <button class="ui disabled large button">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </article>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const product = resolveValue(useProductLoader);
  return {
    title: `${product.name} | Edge Commerce`,
    meta: [
      {
        name: 'description',
        content: product.description,
      },
    ],
  };
};