import { component$, useStore, $ } from '@builder.io/qwik';
import type { ProductSchema } from '../../utils/github-cms';

// Extend Window to include global scripts loaded asynchronously via CDNJS[cite: 3].
declare global {
  interface Window {
    simpleCart: any;
    dayjs: any;
  }
}

interface ProductCardProps {
  product: ProductSchema;
}

/**
 * Implementing component$ Closures for Surgical UI Rendering[cite: 3].
 * The agent must design independent components where parents do not strictly dictate child rendering[cite: 2].
 */
export const ProductCard = component$<ProductCardProps>(({ product }) => {
  // State Proxies: Instantiating Reactivity via useStore() without Global Rerenders[cite: 3].
  // The proxy enters a learn mode, updating only the affected elements[cite: 2].
  const state = useStore({
    isAdding: false,
    quantity: 1,
  });

  /**
   * Attaching Bound Handlers: Interactivity Mechanics via Client-Paired Event Tokens[cite: 3].
   * The framework serializes listeners into HTML attributes and downloads handlers only upon explicit interaction[cite: 2].
   */
  const addToCart$ = $(() => {
    state.isAdding = true;
    
    // Privacy-First Edge Metrics: Tracking Temporal Vectors with Lightweight Date Closures[cite: 3].
    const timestamp = window.dayjs ? window.dayjs().format('YYYY-MM-DD HH:mm:ss') : new Date().toISOString();
    console.info(`[${timestamp}] Analytics: Product ${product.id} added to local basket.`);

    // Local Storage Shopping Baskets: Stateless DOM Manipulation via Lightweight Ecosystems[cite: 3].
    // Offloading cart state to SimpleCartJS to maintain a zero-hydration footprint.
    if (window.simpleCart) {
      window.simpleCart.add({
        name: product.name,
        price: product.price,
        size: 'Default',
        quantity: state.quantity,
        id: product.id
      });
    }

    // Surgical reactivity update: Drops the loading spinner[cite: 2].
    setTimeout(() => {
      state.isAdding = false;
    }, 400);
  });

  return (
    // The agent must express entities in a serializable, DOM-centric way[cite: 2].
    <article class="ui raised card">
      <div class="image placeholder">
        {/* Assets served directly from public/ to dist/ via Cloudflare[cite: 2] */}
      </div>
      <div class="content">
        <div class="header">{product.name}</div>
        <div class="meta">
          <span class="price">{product.currency} {product.price.toFixed(2)}</span>
        </div>
        <div class="description">
          {product.description}
        </div>
      </div>
      <div class="extra content">
        {product.inStock ? (
          <button 
            class={`ui primary fluid button ${state.isAdding ? 'loading' : ''}`}
            onClick$={addToCart$}
          >
            <i class="cart plus icon"></i>
            Add to Basket
          </button>
        ) : (
          <button class="ui disabled fluid button">
            Out of Stock
          </button>
        )}
      </div>
    </article>
  );
});