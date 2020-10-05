import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { createProvider, getProvider, getValue } from './provider.js';

const provider = Symbol('provider');
const contextId = Symbol('context');

const createContextProvider = (initialValue) => createProvider(initialValue, contextId);

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

    // eslint-disable-next-line class-methods-use-this
    onContextChanged() {}
  };
});

export { contextConsumerMixin, createContextProvider };
