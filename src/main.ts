import { createGUI } from "./gui";
import { arcCercle, line, arcTo } from "./draw";
import { degreesToRadians, getRandomColor } from "./utils";
import { onBeat } from "./beat";
import setupUI from "./ui";

const parameters = {
  persistence: 0.02,
  scene: 1,
};
const gui = createGUI(parameters);

const windowContent = document.querySelector(".window-content")!;
const playButton = document.querySelector("#play-button")!;
const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;
const audioElement = document.querySelector("audio")!;
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
let matrixColor: string | null = null;

onBeat((timestamp: number) => {
  if (!playing) return;
  console.log("beat", timestamp);
  switch (parameters.scene) {
    case 0:
      onBeatThingus();
      break;
    case 1:
      onBeatMatrix();
      break;
    case 2:
      onBeatMatrix();
      onBeatThingus();
      break;
    default:
      console.warn("Unknown scene:", parameters.scene);
      break;
  }
});

addEventListener("DOMContentLoaded", setupUI);

addEventListener("resize", resize);

playButton?.addEventListener("click", async () => {
  playing ? pause() : play();
  resize();
  tick();
});

function render() {
  if (!playing) return;
  context.translate(0, 0);
  context.rotate(0);
  context.fillStyle = `rgba(0, 0, 0, ${parameters.persistence})`;
  context.fillRect(0, 0, canvas.width * 2, canvas.height * 2);
  switch (parameters.scene) {
    case 0:
      thingus();
      break;
    case 1:
      matrix();
      break;
    case 2:
      matrix();
      thingus();
      break;
    default:
      console.warn("Unknown scene:", parameters.scene);
      break;
  }
}

function resize() {
  canvas.width = windowContent.clientWidth;
  canvas.height = windowContent.clientHeight;
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

function thingus() {
  context.strokeStyle = lineColor;
  context.lineWidth = 0.5;

  waves.forEach((wave, index) => {
    context.beginPath();
    context.moveTo(wave.x, 0);

    for (let y = 0; y < canvas.width; y++) {
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
  let rotation = degreesToRadians(Math.random() * 360);
  context.rotate(rotation);
  context.translate(-canvas.width / 2, -canvas.height / 2);
}

function matrix() {
  context.fillStyle = matrixColor || "#00FF00";
  for (let i = 0; i < canvas.width; i++) {
    context.fillRect(
      i * 20,
      Math.random() * canvas.height,
      Math.max(2.5, Math.random() * 10),
      Math.max(10, Math.random() * 20),
    );
  }
}

function onBeatMatrix() {
  matrixColor = getRandomColor();
}
