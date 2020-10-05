import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { createProvider, getProvider, getValue } from './provider.js';

const provider = Symbol('provider');
const contextId = Symbol('context');

/**
 * Creates a Provider class.
 * @param {*} initialValue Initial value of the context
 */
const createContextProvider = (initialValue) => createProvider(initialValue, contextId);

/**
 * Provides a `context` property with the value of the nearest Provider component.
 * Changes in the `value` property of the Provider can be handled by implementing
 * the `onContextChanged()` hook.
 *
 * @mixin
 */
const contextConsumerMixin = dedupeMixin((SuperClass) => {
  return class Consumer extends SuperClass {
    constructor() {
      super();
      this.onContextChanged = this.onContextChanged.bind(this);
    }

    get context() {
      return getValue(contextId, this);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this[provider] = getProvider(contextId, this);

      if (this[provider]) {
        this[provider].addEventListener('context-changed', this.onContextChanged);
      }
    }

    disconnectedCallback() {
      if (this[provider]) {
        this[provider].removeEventListener('context-changed', this.onContextChanged);
      }

      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    /**
     * Callback executed when the nearest Provider changes its `value` property.
     */
    // eslint-disable-next-line class-methods-use-this
    onContextChanged() {}
  };
});

export { contextConsumerMixin, createContextProvider };
