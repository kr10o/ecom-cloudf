import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';

export const EdgeCheckout = component$(() => {
  const formRef = useSignal<HTMLFormElement>();
  const cartPayloadRef = useSignal<HTMLInputElement>();
  const sessionDurationRef = useSignal<HTMLInputElement>();

  // useVisibleTask$ isolates DOM-mutating scripts from the server.
  // It boots only when the user scrolls the checkout form into view.
  useVisibleTask$(({ cleanup }) => {
    // 1. Session Analytics Inception (Privacy-First)
    // @ts-ignore - Loaded globally via CDNJS
    const sessionStart = dayjs();

    // 2. SimpleCartJS DOM Interception & Cart State Inversion
    // @ts-ignore
    simpleCart({
      cartColumns: [
        { attr: "name", label: "Item" },
        { attr: "price", label: "Price", view: 'currency' },
        { attr: "quantity", label: "Qty" },
        { attr: "total", label: "SubTotal", view: 'currency' },
      ],
      cartStyle: "table"
    });

    // Intercept checkout to serialize the cart buffer into the DOM
    // @ts-ignore
    simpleCart.bind('beforeCheckout', () => {
      const items: any[] = [];
      // @ts-ignore
      simpleCart.each((item: any) => {
        items.push({ 
          sku: item.get('id'), 
          qty: item.get('quantity'), 
          price: item.get('price') 
        });
      });
      
      // Serialize array buffer into the hidden input for the serverless POST action
      cartPayloadRef.value!.value = JSON.stringify(items);

      // Compute temporal metric without tracking pixels
      // @ts-ignore
      const sessionEnd = dayjs();
      sessionDurationRef.value!.value = sessionEnd.diff(sessionStart, 'second').toString();
    });

    // 3. Input Form Protections via FormValidation + Semantic UI
    // @ts-ignore
    const fv = $(formRef.value).formValidation({
      framework: 'semantic',
      icon: {
        valid: 'checkmark icon',
        invalid: 'remove icon',
        validating: 'refresh icon'
      },
      fields: {
        email: {
          validators: {
            notEmpty: { message: 'A secure email address is required.' },
            emailAddress: { message: 'The value is not a valid email address.' }
          }
        }
      }
    });

    // Defensive memory cleanup: Destroy validators if the component unmounts
    cleanup(() => {
       // @ts-ignore
       $(formRef.value).formValidation('destroy');
    });
  });

  return (
    <section class="ui container">
      <form 
        class="ui form segment" 
        ref={formRef} 
        action="/api/v1/checkout-dispatch" 
        method="POST"
      >
        <h3 class="ui dividing header">Encrypted Edge Checkout</h3>

        <div class="field">
          <label>Email Address</label>
          <div class="ui left icon input">
            <i class="envelope icon"></i>
            <input type="email" name="email" placeholder="customer@example.com" />
          </div>
        </div>

        <div class="field">
          <label>Stateless Cart Buffer</label>
          <div class="ui secondary segment">
            {/* SimpleCartJS injects the table here without framework interference */}
            <div class="simpleCart_items"></div>
            <div class="ui divider"></div>
            <strong>Total Amount: <span class="simpleCart_total"></span></strong>
          </div>
        </div>

        {/* Cart State Inversion: Serialized memory buffers passed as standard form data */}
        <input type="hidden" name="cart_payload" ref={cartPayloadRef} />
        <input type="hidden" name="session_duration" ref={sessionDurationRef} />

        <button type="submit" class="ui primary button simpleCart_checkout">
          <i class="lock icon"></i> Process Transaction
        </button>
      </form>
    </section>
  );
});