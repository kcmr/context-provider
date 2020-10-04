import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { createProvider, getProvider, getValue } from './provider';

const provider = Symbol();
const contextId = Symbol();

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
      super.connectedCallback();

      this[provider] = getProvider(contextId, this);

      if (this[provider]) {
        this[provider].addEventListener('context-changed', this.onContextChanged);
      }
    }

    disconnectedCallback() {
      if (this[provider]) {
        this[provider].removeEventListener('context-changed', this.onContextChanged);
      }

      super.disconnectedCallback();
    }

    onContextChanged() {}
  };
});

export { contextConsumerMixin, createContextProvider };
