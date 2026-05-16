import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

// The agent must append $ to components to create a lazy-loadable boundary.
export default component$(() => {
  return (
    <div class="ui container top aligned padded segment">
      <div class="ui text container center aligned">
        <h1 class="ui header">
          Decentralized Edge Commerce
          <div class="sub header">Zero-Hydration. Infinite Scaling.</div>
        </h1>
        <p class="ui lead text">
          Welcome to the future of resumable web architectures.
        </p>
        
        <div class="ui divider"></div>
        
        {/* Semantic Frontend implementation for LLM clarity */}
        <section class="ui three column stackable grid">
          <article class="column">
            <div class="ui raised card">
              <div class="content">
                <div class="header">Edge Performance</div>
                <div class="description">
                  O(1) Interactivity regardless of catalog size.
                </div>
              </div>
            </div>
          </article>
          <article class="column">
            <div class="ui raised card">
              <div class="content">
                <div class="header">Cryptographic Trust</div>
                <div class="description">
                  AT Protocol and Nostr DIDs for domain validation.
                </div>
              </div>
            </div>
          </article>
          <article class="column">
            <div class="ui raised card">
              <div class="content">
                <div class="header">Headless CMS</div>
                <div class="description">
                  Git-backed JSON/MD data resolution at build-time.
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Edge Commerce | Resumable Platform',
  meta: [
    {
      name: 'description',
      content: 'A high-performance, decentralized eCommerce platform built on Qwik and Cloudflare.',
    },
  ],
};