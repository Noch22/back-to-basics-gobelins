import { createGUI } from "./gui";
import { arcCercle, line, arcTo } from "./draw";
import { degreesToRadians } from "./utils";
import { onBeat } from "./beat";

const parameters = {
  persistence: 0.02,
  scene: 0,
};
const gui = createGUI(parameters);

const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;
const audioElement = document.querySelector("audio")!;
const loginButton = document.getElementById("login-button")!;
let playing = false;
const waves = Array.from({ length: 4 }, () => ({
  x: Math.random() * canvas.width,
  length: Math.random() * 0.002 + 0.005,
  amplitude: Math.random() * 15 + 20,
  frequency: Math.random() * 0.02 + 0.005,
}));

const lineColor = context.createLinearGradient(
  0,
  0,
  canvas.width,
  canvas.height,
);
lineColor.addColorStop(0, "#44CFCB");
lineColor.addColorStop(0.25, "#122C34");
lineColor.addColorStop(0.5, "#2A4494");
lineColor.addColorStop(0.75, "#224870");
lineColor.addColorStop(1, "#4EA5D9");

const increments = waves.map((wave) => wave.frequency);

onBeat((timestamp: number) => {
  console.log("beat", timestamp);
  switch (parameters.scene) {
    case 0:
      onBeatThingus();
      break;
    case 1:
      // Implement scene 1 behavior here
      break;
    default:
      console.warn("Unknown scene:", parameters.scene);
      break;
  }
});

loginButton?.addEventListener("click", () => {
  switchView();
});

addEventListener("resize", resize);

addEventListener("click", async () => {
  playing ? pause() : play();
  resize();
  tick();
});

function render() {
  context.translate(0, 0);
  context.rotate(0);
  context.fillStyle = `rgba(0, 0, 0, ${parameters.persistence})`;
  context.fillRect(0, 0, canvas.width, canvas.height);

  switch (parameters.scene) {
    case 0:
      thingus();
      break;
    case 1:
      // Implement scene 1 rendering here
      break;
    default:
      console.warn("Unknown scene:", parameters.scene);
      break;
  }
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function tick() {
  requestAnimationFrame(tick);
  render();
}

function play() {
  playing = true;
  audioElement.play();
}

function pause() {
  playing = false;
  audioElement.pause();
}

function switchView() {
  const loginView = document.getElementById("login-view");
  const mainView = document.getElementById("main-view");

  if (loginView && mainView) {
    loginView.style.display = "none";
    mainView.hidden = false;
  }
  console.log("Switching view to main view");
}

function thingus() {
  context.strokeStyle = lineColor;
  context.lineWidth = 2;

  waves.forEach((wave, index) => {
    // Drawing magic happens here
    context.beginPath();
    context.moveTo(wave.x, 0);

    // Create wave path
    for (let y = 0; y < canvas.height; y++) {
      context.lineTo(
        wave.x + Math.sin(y * wave.length + increments[index]) * wave.amplitude,
        y,
      );
    }

    context.stroke();
    increments[index] += wave.frequency;
  });
}

function onBeatThingus() {
  waves.push({
    x: canvas.width / 2,
    length: Math.random() * 0.002 + 0.005,
    amplitude: Math.random() * 15 + 20,
    frequency: Math.random() * 0.02 + 0.005,
  });
  waves.shift();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(degreesToRadians(Math.random() * 360));
  context.translate(-canvas.width / 2, -canvas.height / 2);
  context.rotate(degreesToRadians(0));
}
