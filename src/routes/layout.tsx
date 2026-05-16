import { component$, Slot, useStore, useVisibleTask$ } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Fine-Tuning Caching Protocols via Cache-Control: public, max-age=31536000, immutable[cite: 3]
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export default component$(() => {
  // The useStore() hook returns a store proxy[cite: 2].
  const sessionState = useStore({
    initTime: '',
    sessionId: ''
  });

  // Bypassing Hydration Cracks: Hooking External State using Qwik’s useVisibleTask$[cite: 3]
  useVisibleTask$(() => {
    if (window.dayjs) {
      sessionState.initTime = window.dayjs().format('YYYY-MM-DDTHH:mm:ssZ');
      sessionState.sessionId = crypto.randomUUID();
    }
  });

  return (
    <div class="ui container">
      <header class="ui menu inverted">
        <div class="header item">
          Next-Gen Edge Platform
        </div>
        <div class="right menu">
          <div class="item">
            <div class="ui primary button">
              <i class="shopping cart icon"></i> 
              <span class="simpleCart_total"></span>
            </div>
          </div>
        </div>
      </header>

      <main class="ui segment basic">
        {/* Child renders do not force parent renders[cite: 2]. */}
        <Slot />
      </main>

      <footer class="ui footer segment basic center aligned">
        <p>Session started at: {sessionState.initTime || 'Loading edge metrics...'}</p>
        <p class="ui text grey small">ID: {sessionState.sessionId}</p>
      </footer>
    </div>
  );
});