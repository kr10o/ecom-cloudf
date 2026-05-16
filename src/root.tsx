import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import './global.css'; // Semantic UI CSS imported here

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        
        {/* Semantic UI CSS Framework - Render Blocking but required for initial FOUC prevention */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.css" />

        {/* 
          Asynchronous CDNJS Ingestion Protocol
          The 'defer' attribute guarantees these do not halt the HTML parser.
          They are fetched via Cloudflare's edge CDN, arriving just in time for Qwik's useVisibleTask$.
        */}
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js"></script>
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/simplecartjs/2.2.3/simpleCart.min.js"></script>
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/formvalidation/0.6.2-dev/js/formValidation.min.js"></script>
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/formvalidation/0.6.2-dev/js/framework/semantic.min.js"></script>
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});