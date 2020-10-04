import { createProvider, getProvider, getValue } from './provider';

const provider = Symbol();
const contextId = Symbol();

const createContextProvider = (initialValue) => createProvider(initialValue, contextId);

class Consumer extends HTMLElement {
  constructor() {
    super();
    this.onContextChanged = this.onContextChanged.bind(this);
  }

  get context() {
    return getValue(contextId, this);
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();

    this[provider] = getProvider(contextId, this);

    if (this[provider]) {
      this[provider].addEventListener('context-changed', this.onContextChanged);
    }
  }

  disconnectedCallback() {
    if (this[provider]) {
      this[provider].removeEventListener('context-changed', this.onContextChanged);
    }
  }

  onContextChanged() {}
}

export { Consumer, createContextProvider };
