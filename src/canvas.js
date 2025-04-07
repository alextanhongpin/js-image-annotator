export function annotate() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let start = { x: 0, y: 0 };

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    start = getPosition(e);
  });

  canvas.addEventListener("mousemove", (e) => {
    const end = getPosition(e);

    clear();
    drawGuideLines(end);
    if (!isDrawing) return;

    drawRect(computeRect(start, end));
  });

  canvas.addEventListener("mouseup", (e) => {
    if (isDrawing) {
      const end = getPosition(e);
      const rect = computeRect(start, end);
      if (isValidRect(rect)) {
        const event = new CustomEvent("boxend", {
          detail: rect,
        });
        canvas.dispatchEvent(event);
      }
    }
    isDrawing = false;
    clear();
  });

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawGuideLines({ x, y }) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  function isValidRect({ x, y, width, height }) {
    return x >= 0 && y >= 0 && width > 10 && height > 10;
  }

  function computeRect(p1, p2) {
    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const width = Math.abs(p1.x - p2.x);
    const height = Math.abs(p1.y - p2.y);

    return { x, y, width, height };
  }

  function drawRect({ x, y, width, height }) {
    // Draw the end bounding box
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  return canvas;
}
