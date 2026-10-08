// Initialize AudioContext and AnalyserNode
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const freqData = new Float32Array(bufferLength);

// Load audio source (e.g., <audio> element)
const audioElement = document.querySelector("audio");
const sourceNode = audioCtx.createMediaElementSource(audioElement);
sourceNode.connect(analyser);
analyser.connect(audioCtx.destination);

// Spectral Flux variables
let lastSpectrum = new Float32Array(bufferLength);
let beatCallback = () => {};

export function onBeat(callback) {
  beatCallback = callback;
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
