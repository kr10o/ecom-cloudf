import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import './global.css';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * The framework serializes component boundary information.
   */
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        {/* Semantic Frontend: Sourcing Semantic UI via CDNJS for clean signaling */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css" 
        />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
        
        {/* Defer Attribute Protocol: Asynchronous Asset Loading from Cloudflare’s CDNJS Backbone */}
        <script 
          src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js" 
          defer
        ></script>
        <script 
          src="https://cdnjs.cloudflare.com/ajax/libs/simplecartjs/2.2.3/simplecart.js" 
          defer
        ></script>
      </body>
    </QwikCityProvider>
  );
});