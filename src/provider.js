const store = new WeakMap();
const providerId = Symbol('provider');

const createProvider = (initialValue, identifier) => {
  return class Provider extends HTMLElement {
    constructor() {
      super();
      this.value = initialValue;
      this[providerId] = identifier;
    }

    set value(value) {
      store.set(this, value);
      this.dispatchEvent(new Event('context-changed'));
    }

    get value() {
      return store.get(this);
    }
  };
};

const getProvider = (identifier, context) => {
  if (!context || context === window) {
    return undefined;
  }

  if (context[providerId] === identifier) {
    return context;
  }

  if (context instanceof ShadowRoot) {
    return getProvider(identifier, context.host);
  }

  return getProvider(identifier, context.parentElement || context.parentNode);
};

const getValue = (identifier, context) => {
  const nearestProvider = getProvider(identifier, context);
  return nearestProvider && nearestProvider.value;
};

export { createProvider, getProvider, getValue };
