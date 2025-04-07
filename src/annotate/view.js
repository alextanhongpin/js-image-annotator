export class CanvasView {
  constructor(el) {
    this.el = el;
    if (!(this.el instanceof HTMLCanvasElement)) {
      throw new Error(`${this.constructor.name}: el must be a canvas element`);
    }
  }

  render(boxes) {
    const canvas = this.el;
    const ctx = this.el.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boxes.forEach((box) => {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  }
}
