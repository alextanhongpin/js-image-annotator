class ImageBox extends HTMLElement {
	constructor() {
		super()
	}

  connectedCallback() {
  }

  static get observedAttributes() {
    return ['data-x', 'data-y', 'data-width', 'data-height'];
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(this.name, `Attribute ${name} has changed.`, oldValue, newValue);
  }
}

customElements.define("img-box", ImageBox);

export default ImageBox;
