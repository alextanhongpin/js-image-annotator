import { State } from "./model.js";
import { CanvasAnnotatorController } from "./controller.js";
import { CanvasView, ToolBoxView } from "./view.js";

class App {
  constructor() {
    this.state = new State();

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

    // Controllers.
    overlay.addEventListener("change", (evt) => {
      const box = evt.detail;
      this.state.store("boxes", (boxes = []) => {
        const newBox = {
          id: performance.timeOrigin + performance.now(),
          ...box,
        };

        return [...boxes, newBox];
      });
    });

    imgPicker.addEventListener("change", (evt) => {
      const files = evt.target.files;
      const src = URL.createObjectURL(files[0]);
      this.state.store("img/src", src);
    });

    // Views.
    this.state.on({
      "img/size": (evt) => {
        const { width, height } = evt.detail;
        overlay.el.width = width;
        overlay.el.height = height;

        display.el.width = width;
        display.el.height = height;
      },
      "img/src": (evt) => {
        preview.src = evt.detail;

        const img = new Image();
        img.onload = () => {
          this.state.store("img/size", {
            width: img.width,
            height: img.height,
          });
        };
        img.src = evt.detail;
      },
      boxes: (evt) => {
        const boxes = evt.detail || [];
        display.render(boxes);
        toolbox.render(boxes);

        Array.from(toolbox.el.querySelectorAll(".box")).forEach((box) => {
          const button = box.querySelector(".delete-box");
          button.addEventListener("click", (evt) => {
            const boxId = Number(evt.target.dataset.id);
            const boxes = this.state.load("boxes");
            this.state.store("boxes", (boxes) => {
              return boxes.filter((box) => box.id !== boxId);
            });
          });
        });
      },
    });

    // This must be after registering...
    this.state.store("img/src", preview.src);
  }
}

window.App = window.App || new App();
