import { BoxModel, ImageModel } from "./model.js";
import { CanvasAnnotatorController } from "./controller.js";
import { CanvasView } from "./view.js";

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
    this.img.setSrc(preview.src);

    // Controllers.
    overlay.addEventListener("change", (evt) => {
      const box = evt.detail;
      this.box.add(box);
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
      display.render(this.box.boxes);
    });

    this.img.addEventListener("change", () => {
      preview.src = this.img.src;
    });
  }
}

new App();
