import { createGUI } from "./gui";
import { arcCercle, line, arcTo, strokeStar } from "./draw";
import { degreesToRadians, getRandomColor } from "./utils";
import { onBeat, onPlaying, onFlux, onFluxLine } from "./beat";
import setupUI from "./ui";

const parameters = {
  persistence: 0.02,
  scene: 0,
};
createGUI(parameters);

let lastScene = parameters.scene;

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
      onBeatParticles();
      break;
    case 2:
      onBeatStarPower();
      break;
    case 3:
      onBeatLine();
      break;
    default:
      console.warn("Unknown scene:", parameters.scene);
      break;
  }
});

onPlaying((isPlaying: boolean) => {
  isPlaying ? play() : pause();
  resize();
  tick();
});

addEventListener("DOMContentLoaded", setupUI);

addEventListener("resize", resize);

playButton?.addEventListener("click", () => {
  playing ? pause() : play();
  resize();
  tick();
});

function render() {
  if (!playing) return;
  context.translate(0, 0);
  context.fillStyle = `rgba(0, 0, 0, ${parameters.persistence})`;
  context.fillRect(0, 0, canvas.width * 2, canvas.height * 2);
  switch (parameters.scene) {
    case 0:
      thingus();
      break;
    case 1:
      particles();
      break;
    case 3:
      onFluxLine(context, canvas.width, canvas.height, gradientLine);
      break;
    default:
      console.warn("Unknown scene:", parameters.scene);
      break;
  }
  if (parameters.scene !== lastScene) {
    context.reset();
    lastScene = parameters.scene;
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
    x: Math.random() * canvas.width,
    length: Math.random() * 0.002 + 0.005,
    amplitude: Math.random() * 15 + 20,
    frequency: Math.random() * 0.02 + 0.005,
  });
  waves.shift();
  context.translate(canvas.width / 2, canvas.height / 2);
  let rotation = degreesToRadians(Math.random() * 180 - 90);
  context.rotate(rotation);
  context.translate(-canvas.width / 2, -canvas.height / 2);
}

function particles() {
  context.fillStyle = matrixColor || "#00FF00";
  for (let i = 0; i < canvas.width; i++) {
    context.fillRect(
      i * 2.5,
      Math.random() * canvas.height,
      Math.max(2.5, Math.random() * 2.5),
      Math.max(2.5, Math.random() * 2.5),
    );
  }
}

function onBeatParticles() {
  matrixColor = getRandomColor();
}

function onBeatStarPower() {
  let r = Math.random() * canvas.height;
  context.fillStyle = getRandomColor();
  context.filter = `blur(${Math.random() * 30}px)`;
  strokeStar(context, canvas.width / 2, canvas.height / 2, r, 10, 2.5);
  context.filter = "none";
}

let gradientLine = context.createLinearGradient(
  0,
  0,
  canvas.width,
  canvas.height,
);
function onBeatLine() {
  for (let i = 0; i < 10; i++) {
    gradientLine.addColorStop(i / 9, getRandomColor());
  }
}
