const store = new WeakMap();
const providerId = Symbol('provider');

/**
 * Creates a Provider component that notifies changes on its
 * `value` property.
 *
 * @param {*} initialValue Initial value of the Provider
 * @param {*} identifier Provider ID
 */
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

/**
 * Gets the Provider component that matches the identifier.
 *
 * @param {*} identifier Provider identifier.
 * @param {HTMLElement} context
 */
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

/**
 * Gets the value of the Provider that matches the identifier.
 *
 * @param {*} identifier Provider identifier.
 * @param {HTMLElement} context
 */
const getValue = (identifier, context) => {
  const nearestProvider = getProvider(identifier, context);
  return nearestProvider && nearestProvider.value;
};

export { createProvider, getProvider, getValue };
