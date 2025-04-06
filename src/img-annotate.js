import { ImageAnnotator } from './model.js';

class ImageAnnotate extends HTMLElement {
	constructor() {
		super()
	}

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Views
    const layer = document.createElement('div')

    const annotator = new ImageAnnotator()
    annotator.addEventListener('boxAdded', (e) => {
      const data = e.detail
      const span = document.createElement('span')
      span.textContent = `${data.label} (${data.x}, ${data.y})`
      span.onclick = () => {
        annotator.removeBox(data)
      }
      layer.appendChild(span)

      draw()
    })

    annotator.addEventListener('boxRemoved', (e) => {
      const data = e.detail
      const span = layer.querySelector(`span:last-child`)
      if (span) {
        layer.removeChild(span)
      }

      draw()
    })


    const boxes = Array.from(this.querySelectorAll('img-box'))
    boxes.forEach(box => {
      const data = {
        id: performance.timeOrigin + performance.now(),
        x: Number(box.getAttribute('data-x')),
        y: Number(box.getAttribute('data-y')),
        width: Number(box.getAttribute('data-width')),
        height: Number(box.getAttribute('data-height')),
        label: box.getAttribute('data-label')
      }
      annotator.addBox(data)
    })


    const img = document.createElement('img')
    img.src = this.getAttribute('src')
    img.width = 200
    img.onload = () => {

      canvas.width = img.width;
      canvas.height = img.height;

      draw()
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      annotator.boxes.forEach(data => {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(data.x, data.y, data.width, data.height);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.strokeRect(data.x, data.y, data.width, data.height);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(data.label, data.x + 5, data.y + 25);
      })
    }


    const style = document.createElement('style')
    style.textContent = `
      canvas {
        position: absolute;
      }
    `

    const pop = document.createElement('button')
    pop.textContent = 'Add Box'
    pop.onclick = () => {
      annotator.addBox({
        id: performance.timeOrigin + performance.now(),
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        label: 'test'
      })
    }

    const remove = document.createElement('button')
    remove.textContent = 'Remove Box'
    remove.onclick = () => {
      const box = this.querySelector('img-box:last-child')
      if (box) {
        this.removeChild(box)
      }

      annotator.popBox()
    }

    shadow.appendChild(style)
    shadow.appendChild(canvas)
    shadow.appendChild(img)
    shadow.appendChild(layer)
    shadow.appendChild(pop)
    shadow.appendChild(remove)

    const observer = new MutationObserver(function(mutations_list) {
      mutations_list.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(added_node) {
          console.log('added', added_node)
          if(added_node.id == 'child') {
            console.log('#child has been added');
            observer.disconnect();
          }
        });
        mutation.removedNodes.forEach(function(removed_node) {
          console.log('removed', removed_node)
          if(removed_node.id == 'child') {
            console.log('#child has been removed');
            observer.disconnect();
          }
        })
      });
    });

    observer.observe(this, { subtree: false, childList: true });
  }

  static get observedAttributes() {
    return ['src'];
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`, oldValue, newValue);
  }
}

/*
What are the input?
- x, y, width, height
- canvas width, height
- image source
- label
 
*/

customElements.define("img-annotate", ImageAnnotate);

export default ImageAnnotate;
