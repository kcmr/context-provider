import { assert, defineCE, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import sinon from 'sinon';
import { createContextProvider, contextConsumerMixin } from '../src/index.js';

suite('contextConsumerMixin', () => {
  test('a component with the mixin has a "context" property', async () => {
    const tag = defineCE(class extends contextConsumerMixin(HTMLElement) {});
    const el = await fixture(`<${tag}></${tag}>`);

    assert.property(el, 'context');
  });

  test('the "context" property has the value of the nearest Provider Element', async () => {
    const expected = 'any';

    class Consumer extends contextConsumerMixin(HTMLElement) {}
    customElements.define('test-consumer', Consumer);
    customElements.define('test-provider-inner', createContextProvider(expected));
    customElements.define('test-provider-outer', createContextProvider('other'));

    const composite = await fixture(html`
      <test-provider-outer>
        <test-provider-inner>
          <test-consumer></test-consumer>
        </test-provider-inner>
      </test-provider-outer>
    `);

    const el = composite.querySelector('test-consumer');

    assert.strictEqual(el.context, expected);
  });

  test('calls "onContextChanged" when the Provider value changes', async () => {
    class Consumer extends contextConsumerMixin(LitElement) {
      onContextChanged() {
        super.onContextChanged();
        this.spied();
      }
      spied() {}
    }

    customElements.define('test-consumer-2', Consumer);
    customElements.define('test-provider-2', createContextProvider('initial value'));

    const composite = await fixture(html`
      <test-provider-2>
        <test-consumer-2></test-consumer-2>
      </test-provider-2>
    `);

    const consumer = composite.querySelector('test-consumer-2');
    const onContextChangedSpy = sinon.spy(consumer, 'spied');

    consumer.parentElement.value = 'new value';
    assert.isTrue(onContextChangedSpy.called);
  });
});
