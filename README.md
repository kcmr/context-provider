# Context Provider & Consumer for Web Components

[![npm version](https://badge.fury.io/js/%40kuscamara%2Fcontext-provider.svg)](https://badge.fury.io/js/%40kuscamara%2Fcontext-provider)
[![Build Status](https://travis-ci.com/kcmr/context-provider.svg?token=fKx6tXSkRCMAsjnc8HQK&branch=main)](https://travis-ci.com/kcmr/context-provider)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![codecov](https://codecov.io/gh/kcmr/context-provider/branch/main/graph/badge.svg)](https://codecov.io/gh/kcmr/context-provider)
![Dependency status](https://img.shields.io/david/kcmr/context-provider.svg)

Allows to use context Provider and Consumer components in a similar manner than the [Context in React](https://reactjs.org/docs/context.html).

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

This can be useful for properties or state that is considered global to an application like the language, user information or media query breakpoints.

The value of the nearest Provider component is available to Consumer components in their `context` property regardless the level of nesting without the need to pass properties from parents to children.

## Usage

**Install**

```bash
npm i @kuscamara/context-provider
```

**Create a Provider**

```js
import { createContextProvider } from '@kuscamara/context-provider';

const globals = /* App globals */;
const ContextProvider = createContextProvider(globals);

window.customElements.define('context-provider', ContextProvider);
```

**Add Consumer capabilities to a component**

```js
import { contextConsumerMixin } from '@kuscamara/context-provider';

class MyComponent extends contextConsumerMixin(HTMLElement) {
  render() {
    // do whatever you need with your context property
    return `<p>My context is ${this.context}</p>`;
  }
}
```

**Set and change the Provider value**

You must set the property, not the attribute.
LitElement is used in this example to emphasize the property binding syntax (`.property`).

```js
import { LitElement, html } from 'lit-element';

class App extends LitElement {
  static get properties() {
    return {
      globals: { type: Object },
    };
  }

  constructor() {
    super();
    this.globals = {
      lang: 'es',
    };
  }

  onLangChange(event) {
    this.globals = {
      ...this.globals,
      lang: event.detail.value,
    };
  }

  render() {
    return html`
      <context-provider .value=${this.globals}>
        <lang-selector @change=${this.onLangChange}></lang-selector>

        <!-- context-consumer has access to the provider value in its "context" property -->
        <context-consumer></context-consumer>
      </context-provider>
    `;
  }
}
```

**Subscribe to changes in the Provider value from consumers**

The `onContextChanged()` hook should be implemented by components using the Consumer mixin that want to react to changes in the `value` property of the Provider.

```js
import { contextConsumerMixin } from '@kuscamara/context-provider';

class MyComponent extends contextConsumerMixin(HTMLElement) {
  // Called when the Provider value changes
  onContextChanged() {
    this.render();
  }

  render() {
    return `<p>My context is ${this.context}</p>`;
  }
}
```

## Development

- `yarn`: install dependencies (required for linting).
- `yarn start`: run the development server.
- `yarn test:watch`: run the test in watch mode.
- `yarn test`: run test with coverage output.

This repository uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to automatically generate the releases and Changelog.

## Acknowledgments

The Provider and Consumer are **highly inspired by [Masquerades](https://github.com/alfredosalzillo/masquerades)**, a library for styled Web Components.

## License

This project is licensed under the [MIT License](LICENSE).
