import { component$, useStore, $ } from '@builder.io/qwik';

interface ProductProps {
  id: string;
  name: string;
  price: number;
  currency: string;
  sku: string;
  description: string;
}

export const AeoProduct = component$<ProductProps>((props) => {
  // Reactive proxy tracking explicit client-side interactivity state
  const state = useStore({
    addedToCart: false,
    quantity: 1,
  });

  // Serializable transaction handler packaged into a distinct QRL boundary
  const handleAddToCart$ = $(() => {
    state.addedToCart = true;
    
    // Dispatches standard client-side event bubble intercepted by SimpleCartJS
    const cartEvent = new CustomEvent('cart:add', {
      detail: {
        sku: props.sku,
        quantity: state.quantity,
        price: props.price,
      },
      bubbles: true,
    });
    window.dispatchEvent(cartEvent);
  });

  return (
    <article 
      class="ui container segment" 
      data-item-id={props.id}
      data-item-sku={props.sku}
    >
      <div class="ui stackable grid">
        <div class="eleven wide column">
          <header class="ui header">
            <h1 class="ui large header" itemProp="name">{props.name}</h1>
            <div class="sub header">SKU: <span itemProp="sku">{props.sku}</span></div>
          </header>
          
          <hr class="ui divider" />
          
          <section class="ui description" itemProp="description">
            <p>{props.description}</p>
          </section>
        </div>

        <div class="five wide column">
          <div class="ui fluid card" itemScope itemType="https://schema.org/Offer">
            <div class="content">
              <div class="header" itemProp="price" content={props.price.toString()}>
                {props.currency} {props.price.toFixed(2)}
              </div>
              <meta itemProp="priceCurrency" content={props.currency} />
              <div class="description">
                <div class="ui form">
                  <div class="field">
                    <label for={`qty-${props.sku}`}>Quantity Input</label>
                    <input
                      id={`qty-${props.sku}`}
                      type="number"
                      min="1"
                      value={state.quantity}
                      onChange$={(e, currentTarget) => {
                        state.quantity = parseInt(currentTarget.value) || 1;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="extra content">
              <button
                type="button"
                onClick$={handleAddToCart$}
                disabled={state.addedToCart}
                class={`ui fluid button ${state.addedToCart ? 'disabled success' : 'primary'}`}
              >
                <i class="shop icon" aria-hidden="true"></i>
                {state.addedToCart ? 'Added to Basket' : 'Execute Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});