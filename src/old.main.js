import { createGUI } from "./gui.js";

(async () => {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");

  const params = {
    pointerDamping: 0.01,
    color: "#000000",
  };

  let frameRequest;
  let time;
  let delta;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let easedPointerX = 0;
  let easedPointerY = 0;

  const image = await new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });

    image.addEventListener("error", (error) => {
      reject(error);
    });
    image.src = "King-Julien.png";
  });

  addEventListener("resize", resize);
  addEventListener("pointermove", onPointermove);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  createGUI(params);
  resize();
  play();

  function onPointermove(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }

  function render() {
    const currentTime = Date.now();
    delta = currentTime - time;
    time = currentTime;
    elapsed += delta;

    easedPointerY +=
      (pointerY - easedPointerY) * Math.min(1, delta * params.pointerDamping);
    easedPointerX +=
      (pointerX - easedPointerX) * Math.min(1, delta * params.pointerDamping);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = params.color;
    context.fillRect(easedPointerX - 50, easedPointerY - 50, 100, 100);

    context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  }

  function tick() {
    frameRequest = requestAnimationFrame(tick);
    render();
  }

  function play() {
    if (frameRequest === undefined) {
      time = Date.now();
      tick();
    }
  }

  function pause() {
    frameRequest && cancelAnimationFrame(frameRequest);
    frameRequest = undefined;
  }

  render();
  tick();
})();
