import { component$, useVisibleTask$, useSignal, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  // Signal references for Semantic UI form boundaries and hidden payloads
  const formRef = useSignal<HTMLFormElement>();
  const cartPayload = useSignal<string>('[]');
  const sessionDuration = useSignal<number>(0);

  // useVisibleTask$ explicitly bypasses hydration cracks, hooking external state 
  // only when the component becomes visible to the user.
  useVisibleTask$(({ cleanup }) => {
    // -------------------------------------------------------------------------
    // 9.1 Privacy-First Edge Metrics
    // -------------------------------------------------------------------------
    // Tracking session inception via lightweight Date closures (Day.js)
    const dayjs = (window as any).dayjs;
    const sessionStart = dayjs();

    // -------------------------------------------------------------------------
    // 9.2 The Serverless Form Invoice Checkout Engine
    // -------------------------------------------------------------------------
    const simpleCart = (window as any).simpleCart;
    const FormValidation = (window as any).FormValidation;

    // Cart State Inversion: Serializing memory buffers into hidden DOM inputs
    const serializeCartToDOM = () => {
      const items: any[] = [];
      simpleCart.each((item: any) => {
        items.push({
          id: item.get('id'),
          name: item.get('name'),
          price: item.get('price'),
          quantity: item.get('quantity'),
        });
      });
      cartPayload.value = JSON.stringify(items);
    };

    // Bind cart updates to our serialization logic
    simpleCart.bind('update', serializeCartToDOM);
    serializeCartToDOM(); // Initial payload generation

    // Input Form Protections: Client-Side Input Enforcements inside Semantic UI
    const fv = FormValidation.formValidation(formRef.value, {
      fields: {
        email: {
          validators: {
            notEmpty: { message: 'A secure email address is required for receipt.' },
            emailAddress: { message: 'The input is not a valid email address.' }
          }
        },
        wallet_address: {
          validators: {
            notEmpty: { message: 'Destination identity address is required.' }
          }
        }
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        semantic: new FormValidation.plugins.Semantic(),
        submitButton: new FormValidation.plugins.SubmitButton(),
      }
    });

    // Processing Intercepts: Hijacking Standard Form Actions
    fv.on('core.form.valid', () => {
      // Calculate temporal vectors for privacy-preserving engagement footprints
      const now = dayjs();
      sessionDuration.value = now.diff(sessionStart, 'second');

      // Dispatching Payloads: Pushing the structured array to Serverless Workers
      fetch('/api/transaction-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: JSON.parse(cartPayload.value),
          metrics: { session_duration_seconds: sessionDuration.value },
          customer: {
            email: formRef.value?.email.value,
            wallet: formRef.value?.wallet_address.value
          }
        })
      })
      .then(response => {
        if (response.ok) {
          // Automated Cleanup: Resetting local client buffers
          simpleCart.empty();
          window.location.href = '/checkout/success';
        } else {
          console.error('Edge dispatch failed. Retrying...');
        }
      })
      .catch(error => console.error('Transaction Error:', error));
    });

    // Memory management closure
    cleanup(() => {
      fv.destroy();
    });
  });

  // Pure Semantic CDNJS Integration for Human-Readable, AI-Parsable DOM
  return (
    <div class="ui container segment" style={{ marginTop: '5vh' }}>
      <h2 class="ui dividing header">
        <i class="lock icon"></i>
        <div class="content">
          Secure Edge Checkout
          <div class="sub header">Decentralized transaction processing</div>
        </div>
      </h2>

      {/* Form rendered purely with Semantic UI class conventions */}
      <form class="ui large form" ref={formRef} onSubmit$={(e) => e.preventDefault()}>
        {/* Memory Buffer Serializations */}
        <input type="hidden" name="cart_payload" bind:value={cartPayload} />
        <input type="hidden" name="session_metrics" bind:value={sessionDuration} />

        <div class="two fields">
          <div class="field">
            <label>Communication Identity (Email)</label>
            <div class="ui left icon input">
              <i class="envelope icon"></i>
              <input type="email" name="email" placeholder="node@edge.local" />
            </div>
          </div>
          <div class="field">
            <label>Decentralized Identity (Wallet/DID)</label>
            <div class="ui left icon input">
              <i class="key icon"></i>
              <input type="text" name="wallet_address" placeholder="did:plc:..." />
            </div>
          </div>
        </div>

        <div class="ui error message"></div>

        <button class="ui right floated primary button" type="submit">
          Dispatch Transaction <i class="right arrow icon"></i>
        </button>
      </form>
    </div>
  );
});

// The Defer Attribute Protocol: Asynchronous Asset Loading from Cloudflare’s CDNJS
export const head: DocumentHead = {
  title: 'Transaction Gateway | Qwik Edge Architecture',
  meta: [
    {
      name: 'description',
      content: 'Secure, zero-hydration checkout processing node.',
    },
  ],
  scripts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js', defer: true },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/simplecartjs/3.0.5/simpleCart.min.js', defer: true },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/formvalidation/0.6.2-dev/js/formValidation.min.js', defer: true },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/formvalidation/0.6.2-dev/js/framework/semantic.min.js', defer: true }
  ],
  styles: [
    { href: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css', rel: 'stylesheet' }
  ]
};