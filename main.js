import * as Tone from 'tone';

let player;
let analyser;
let playClicked = false;

//DOM QUERIES --------------------------------|
const userOGAudio = document.getElementById('userOGAudio');
const newSampleDiv = document.getElementById('newSample');
const setBPM = document.getElementById('setBpm');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;

const distortion = new Tone.Distortion({
  wet: 1,
  distortion: 1,
});
const chorus = new Tone.Chorus({
  wet: 1,
  delayTime: 100,
  depth: 100,
});

const cheby = new Tone.Chebyshev(80);

const phaser = new Tone.Phaser({
  frequency: 15,
  octaves: 5,
  baseFrequency: 1000,
});

const autoFilter = new Tone.AutoFilter({
  frequency: 1,
  type: 'sine',
  depth: 1,
  baseFrequency: 200,
  octaves: 2.6,
  filter: {
    type: 'lowpass',
    rolloff: -12,
    Q: 1,
  },
});

const feedbackDelay = new Tone.FeedbackDelay('8n', 0.5);

const volume = new Tone.Volume(1);

const multiband = new Tone.MultibandCompressor({
  lowFrequency: 200,
  highFrequency: 1300,
  low: {
    threshold: 0,
  },
});
const limiter = new Tone.Limiter(-1);

userOGAudio.addEventListener('change', (event) => {
  Tone.start();
  const fileURL = URL.createObjectURL(event.target.files[0]);
  player = new Tone.Player(fileURL);
  analyser = player.context.createAnalyser();

  analyser.fftSize = 1024;

  player.connect(analyser);

  player.loop = true;
  player.sync().start(0);
  addFX();
  player.toDestination();
});
createButtons();

setBPM.addEventListener('change', (e) => {
  Tone.Transport.bpm.value = e.target.value;
});

setInterval(randomiseValues, 1000);

//FUNCTIONS --------------------------------|

function randomiseValues() {
  console.log('randomising values');
  distortion.wet.value = Math.random();
  chorus.wet.value = Math.random();
  chorus.delayTime = Math.floor(Math.random() * 100);
  chorus.depth = Math.floor(Math.random() * 100);
  cheby.order = Math.floor(Math.random() * 100);
  feedbackDelay.wet.value = Math.random();
  feedbackDelay.feedback.value = Math.random();
  phaser.wet.value = Math.random();
  phaser.frequency.value = Math.floor(Math.random() * 100);
  phaser.octaves = Math.floor(Math.random() * 8);
  phaser.baseFrequency = Math.floor(Math.random() * 1000);
  autoFilter.frequency.value = Math.random();
  autoFilter.depth.value = Math.random();
  autoFilter.wet.value = Math.random();
}
function createButtons() {
  setBPM.setAttribute('value', Tone.Transport.bpm.value);
  const playSample = document.createElement('button');
  playSample.innerText = 'Play Sample';
  playSample.addEventListener('click', () => {
    if (!playClicked) {
      Tone.Transport.start(0);
      playSample.innerText = 'Stop Sample';
      playClicked = true;
    } else if (playClicked) {
      playSample.innerText = 'Play Sample';
      // player.stop();
      Tone.Transport.stop();

      playClicked = false;
    }
  });

  const loopLabel = document.createElement('label');
  loopLabel.htmlFor = 'loopsample';
  loopLabel.innerText = 'Loop Sample';
  const loopSample = document.createElement('input');
  loopSample.id = 'loopsample';
  loopSample.type = 'checkbox';
  loopSample.checked = true;

  newSampleDiv.appendChild(playSample);
  newSampleDiv.appendChild(loopLabel);
  newSampleDiv.appendChild(loopSample);

  loopSample.addEventListener('change', (e) => {
    if (e.target.checked) {
      player.loop = true;
    } else {
      player.loop = false;
    }
  });
}

function addFX() {
  Tone.Destination.chain(
    // distortion,
    chorus,
    phaser,
    // cheby,
    autoFilter,
    feedbackDelay,
    volume,
    multiband,
    limiter
  );
}

function draw() {
  const bufferLength = analyser?.frequencyBinCount;
  const waveform = new Float32Array(bufferLength);
  analyser?.getFloatTimeDomainData(waveform);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const sliceWidth = (canvas.width * 1.0) / bufferLength;

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000000';
  ctx.beginPath();

  for (let i = 0; i < bufferLength; i++) {
    const x = i * sliceWidth;
    const y = (waveform[i] * 1 + 0.5) * canvas.height;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Request the next frame
  requestAnimationFrame(draw);
}

// Start the oscillator and drawing the visualizer

draw();
