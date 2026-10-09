// Initialize AudioContext and AnalyserNode
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const freqData = new Float32Array(bufferLength);

// Load audio source (e.g., <audio> element)
const audioElement = document.querySelector("audio");
const playlist = document.getElementById("playlist");
const sourceNode = audioCtx.createMediaElementSource(audioElement);
sourceNode.connect(analyser);
analyser.connect(audioCtx.destination);

// Spectral Flux variables
let lastSpectrum = new Float32Array(bufferLength);
let beatCallback = () => {};
let playingCallback = () => {};
let fluxCallback = () => {};

export function onBeat(callback) {
  beatCallback = callback;
}

export function onPlaying(callback) {
  playingCallback = callback;
}

export function onFlux(callback) {
  fluxCallback = callback;
}

export function detectBeats() {
  analyser.getFloatFrequencyData(freqData);

  // Compute spectral flux
  let flux = 0;
  for (let i = 0; i < bufferLength; i++) {
    const value = Math.max(0, freqData[i] - lastSpectrum[i]);
    flux += value;
    lastSpectrum[i] = freqData[i];
  }
  fluxCallback(flux);

  // Threshold to determine beat
  if (flux > 1024) {
    const timestamp = audioCtx.currentTime;
    console.log(`Beat detected at ${timestamp}`);
    beatCallback(timestamp);
  }

  requestAnimationFrame(detectBeats);
}

audioElement.onplay = () => {
  audioCtx.resume();
  detectBeats();
};

playlist.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    playingCallback(false);
    audioElement.pause();
    const songId = event.target.id;
    switch (songId) {
      case "song1":
        audioElement.src = "/audio.mp3";
        break;
      case "song2":
        audioElement.src = "/audio2.mp3";
        break;
      case "song3":
        audioElement.src = "/audio3.mp3";
        break;
      default:
        break;
    }
    playingCallback(true);
  }
});

export function onFluxLine(ctx, width, height, gradientLine) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2;
  let x = 0;
  let barHeight;
  let barWidth = (width / bufferLength) * 3;
  for (let i = 0; i < bufferLength; i++) {
    ctx.fillStyle = gradientLine;
    barHeight = Math.pow(freqData[i] / 8, 2);
    ctx.fillRect(x, height / 2 - barHeight, barWidth, barHeight * 2);
    x += barWidth + 15;
  }
}
