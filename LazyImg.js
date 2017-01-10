class LazyImg extends HTMLElement {

  static get observedAttributes() {
    return ['src', 'alt', 'title'];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === 'src') {
      this.imageSet(newValue);
    }
    if (attr === 'alt') {
      this.shadowRoot.querySelector('img').alt = newValue;
    }
    if (attr === 'title') {
      this.shadowRoot.querySelector('img').title = newValue;
    }
  }

  isVisible() {
    const rect = this.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (
            window.innerHeight || 
            document.documentElement.clientHeight
        ) &&
        rect.right <= (
            window.innerWidth || 
            document.documentElement.clientWidth
        )
    );
  }

  addMultipleListener(s, fn) {
    s.split(' ').forEach(e => this.addEventListener(e, fn, false));
  }

  imageSet(attrValue) {
      if (this.isVisible()) {
        const imgElm = this.shadowRoot.querySelector('img');
        if (attrValue !== imgElm.src) {
          fetch(attrValue)
            .then(response => {
                return response.blob();
            })
            .then(imageBlob => {
                imgElm.src = URL.createObjectURL(imageBlob);
            });
        }
      }
  }

  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const img = document.createElement('img');
    const alt = document.createAttribute("alt");
    alt.value = this.getAttribute("alt");
    img.setAttributeNode(alt);
    const title = document.createAttribute("title");
    title.value = this.getAttribute("title");
    img.setAttributeNode(title);
    shadow.appendChild(img);
    this.addMultipleListener('DOMContentLoaded load resize scroll', () => { this.imageSet(this.getAttribute("src")); });
  }
}

customElements.define('lazy-img', LazyImg);

const doc = document.querySelector('#root');
doc.innerHTML = '<lazy-img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSXtu-miUbSmNz8Ih5XLdXOOPiE6sQIvThXpGs08zCGQDpdgFn1" alt="alt" title="title " />';
