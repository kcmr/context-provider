import { createContextProvider, contextConsumerMixin } from './_dist_/index.js';
import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

const ContextProvider = createContextProvider();
const ContextProvider2 = createContextProvider({
  lang: 'bla',
});

class MyComponent extends contextConsumerMixin(LitElement) {
  static get properties() {
    return {
      changed: { type: Boolean },
    };
  }

  onContextChanged() {
    this.changed = true;
    setTimeout(() => (this.changed = false), 400);
  }

  render() {
    const spanClass = classMap({
      lang: true,
      highlight: this.changed,
    });

    return html`<p>
      The current lang is:
      <span class="${spanClass}">${(this.lang || this.context.lang).toUpperCase()}</span>
    </p>`;
  }
}

MyComponent.styles = css`
  :host {
    font-weight: 200;
    font-size: medium;
  }

  p {
    margin: 0.5rem 0;
  }

  .lang {
    padding: 1px 2px;
    border-radius: 2px;
    transition: background-color 0.2s ease-in-out;
  }

  .highlight {
    background-color: #ffeca2;
  }
`;

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
        <div class="lang-selector">
          <label for="lang">Lang</label>
          <select id="lang" @change=${this._onSelectChange}>
            ${this.langs.map((lang) => html` <option .value=${lang}>${lang}</option> `)}
          </select>
        </div>

        <fieldset>
          <legend>Within context-provider</legend>
          <my-component></my-component>

          <fieldset>
            <legend>Within another context-provider</legend>
            <context-provider2>
              <my-component></my-component>
            </context-provider2>
          </fieldset>
        </fieldset>
      </context-provider>

      <fieldset>
        <legend>Without context</legend>
        <my-component lang="fu"></my-component>
      </fieldset>
    `;
  }
}

App.styles = css`
  :host {
    display: block;
    font-size: 95%;
    font-weight: 600;
    font-size: small;
    --border-color: #98d1de;
  }

  :host * + * {
    margin-top: 1.5rem;
  }

  select {
    font: inherit;
    width: 100px;
    height: 30px;
    border-radius: 4px;
    border-color: var(--border-color);
  }

  fieldset {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 10px;
  }
`;

customElements.define('context-provider', ContextProvider);
customElements.define('context-provider2', ContextProvider2);
customElements.define('my-component', MyComponent);
customElements.define('demo-app', App);
