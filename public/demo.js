import { createContextProvider, contextConsumerMixin } from './_dist_/index.js';
import { LitElement, html } from 'lit-element';

const ContextProvider = createContextProvider({
  value1: 'foo',
  value2: 'bar',
});

class MyComponent extends contextConsumerMixin(LitElement) {
  onContextChanged() {
    this.requestUpdate();
  }

  render() {
    return html`<p>
      The current lang is: ${(this.lang || this.context.lang).toUpperCase()}
    </p>`;
  }
}

class App extends LitElement {
  static get properties() {
    return {
      globals: { type: Object },
    };
  }

  constructor() {
    super();

    this.langs = ['es', 'en', 'it'];
    this.globals = {
      lang: 'es',
    };
  }

  _onSelectChange({ target: select }) {
    this.globals = {
      lang: select.value,
    };
  }

  render() {
    return html`
      <context-provider .value=${this.globals}>
        <select @change=${this._onSelectChange}>
          ${this.langs.map((lang) => html` <option .value=${lang}>${lang}</option> `)}
        </select>

        <fieldset>
          <legend>Within context-provider</legend>
          <my-component></my-component>
        </fieldset>
      </context-provider>

      <fieldset>
        <legend>Without context</legend>
        <my-component lang="fu"></my-component>
      </fieldset>
    `;
  }
}

customElements.define('context-provider', ContextProvider);
customElements.define('my-component', MyComponent);
customElements.define('demo-app', App);
