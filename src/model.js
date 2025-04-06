//const target = new EventTarget();
//target.addEventListener('customEvent', console.log);
//target.dispatchEvent(new Event('customEvent'));

export class Box {
  constructor(id, label, x, y, width, height) {
    this.id = id;
    this.label = label;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export class ImageAnnotator extends EventTarget {
  constructor() {
    super();
    this.boxes = [];
  }

  setBoxes(boxes) {
    boxes.forEach((box) => {
      this.addBox(box);
    });
  }

  addBox(box) {
    this.boxes.push(box);
    this.dispatchEvent(new CustomEvent("boxAdded", { detail: box }));
  }

  removeBox(box) {
    this.boxes = this.boxes.filter((b) => b.id !== box.id);
    this.dispatchEvent(new CustomEvent("boxRemoved", { detail: box }));
  }

  popBox() {
    const box = this.boxes.pop();
    this.dispatchEvent(new CustomEvent("boxRemoved", { detail: box }));
    return box;
  }
}
