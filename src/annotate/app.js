import { BoxModel, ImageModel } from "./model.js";
import { CanvasAnnotatorController } from "./controller.js";
import { CanvasView, ToolBoxView } from "./view.js";

class App {
  constructor() {
    this.box = new BoxModel();
    this.img = new ImageModel();

    this.init();
  }

  init() {
    const overlay = new CanvasAnnotatorController(
      document.getElementById("overlay"),
    );
    const display = new CanvasView(document.getElementById("display"));
    const imgPicker = document.querySelector('input[name="image"]');
    const preview = document.querySelector("img");
    const toolbox = new ToolBoxView(document.getElementById("toolbox"));

    this.img.setSrc(preview.src);

    // Controllers.
    overlay.addEventListener("change", (evt) => {
      const box = evt.detail;
      this.box.add({
        id: performance.timeOrigin + performance.now(),
        ...box,
      });
    });

    imgPicker.addEventListener("change", (evt) => {
      const files = evt.target.files;
      this.img.setSrc(URL.createObjectURL(files[0]));
    });

    // Views.
    this.img.addEventListener("resize", () => {
      overlay.el.width = this.img.width;
      overlay.el.height = this.img.height;

      display.el.width = this.img.width;
      display.el.height = this.img.height;
    });

    this.box.addEventListener("change", () => {
      const boxes = this.box.boxes;
      display.render(boxes);

      toolbox.render(boxes).forEach((box) => {
        const button = box.querySelector(".delete-box");
        button.addEventListener("click", (evt) => {
          const boxId = Number(evt.target.dataset.id);
          this.box.remove(Number(boxId));
        });
      });
    });

    this.img.addEventListener("change", () => {
      preview.src = this.img.src;
    });
  }
}

new App();
