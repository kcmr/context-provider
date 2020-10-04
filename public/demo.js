import { createContextProvider, Consumer } from './_dist_/index.js';
import { LitElement, html } from 'lit-element';

const ContextProvider = createContextProvider({
  value1: 'foo',
  value2: 'bar',
});

const root = Symbol();
function render(context) {
  context[root] = context[root] || context.attachShadow({ mode: 'open' });
  context[root].innerHTML = context.render(context);
}

class ContextConsumer extends Consumer {
  connectedCallback() {
    super.connectedCallback();
    render(this);
  }

  onContextChanged() {
    render(this);
  }

  render({ context }) {
    return `<p>My context is <pre>${JSON.stringify(context, null, 2)}</pre></p> `;
  }
}

class App extends LitElement {
  static get properties() {
    return {
      _value: { type: Object },
    };
  }

  constructor() {
    super();
    this._value = {
      uno: 'foo',
      dos: 'bar',
    };
  }

  _onButtonClick() {
    this._value = {
      ...this._value,
      dos: 'bla',
      tres: 'catorce',
    };
  }

  render() {
    return html`
      <context-provider .value=${this._value}>
        <button @click=${this._onButtonClick}>Change context</button>
        <context-consumer></context-consumer>
      </context-provider>
    `;
  }
}

customElements.define('context-provider', ContextProvider);
customElements.define('context-consumer', ContextConsumer);
customElements.define('demo-app', App);
