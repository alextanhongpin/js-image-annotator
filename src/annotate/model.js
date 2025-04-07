export class BoxModel extends EventTarget {
  events = {
    change: "notify when boxes are added or removed",
  };

  constructor() {
    super();

    this.boxes = [];
  }

  add(...boxes) {
    // Update state.
    this.boxes.push(...boxes);

    // Publish event.
    // We don't publish states changes, the view has to retrieve it from the model.
    this.dispatchEvent(new Event("change"));
  }

  remove(id) {
    // Update state.
    this.boxes = this.boxes.filter((box) => box.id !== id);

    // Publish event.
    this.dispatchEvent(new Event("change"));
  }
}

export class ImageModel extends EventTarget {
  events = {
    change: "notify when image is set",
    resize: "notify when image is resized",
  };

  constructor() {
    super();

    this.src = "";
    this.width = 0;
    this.height = 0;
  }

  setSrc(src) {
    // Update state.
    this.src = src;
    // Publish event.
    this.dispatchEvent(new Event("change"));

    const img = new Image();
    img.onload = () => {
      this.setSize(img.width, img.height);
    };
    img.src = src;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.dispatchEvent(new Event("resize"));
  }
}
