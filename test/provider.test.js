import { assert, defineCE, fixture } from '@open-wc/testing';
import sinon from 'sinon';
import { createProvider } from '../src/provider.js';

suite('createProvider()', () => {
  test('returns a class with a "value" property initialized with the value of the first param', async () => {
    const expected = 'any';
    const tag = defineCE(createProvider(expected));
    const el = await fixture(`<${tag}></${tag}>`);

    assert.strictEqual(el.value, expected);
  });
});

suite('Provider Element', () => {
  test('setting the "value" property emits "context-changed" event', async () => {
    const tag = defineCE(createProvider('initial value'));
    const el = await fixture(`<${tag}></${tag}>`);
    const eventSpy = sinon.spy();
    el.addEventListener('context-changed', eventSpy);

    el.value = 'new value';

    assert.isTrue(eventSpy.called);
  });

  test('getting the "value" property returns the last value', async () => {
    const tag = defineCE(createProvider('initial value'));
    const el = await fixture(`<${tag}></${tag}>`);
    const expected = 'new value';

    el.value = expected;

    assert.strictEqual(el.value, expected);
  });
});
