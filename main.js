import * as Tone from 'tone';

let player;
let buttonClicked = 0;

//DOM QUERIES --------------------------------|
const userOGAudio = document.getElementById('userOGAudio');
const newSampleDiv = document.getElementById('newSample');
const mutilateBtn = document.getElementById('mutilate');

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

const multiband = new Tone.MultibandCompressor({
  lowFrequency: 200,
  highFrequency: 1300,
  low: {
    threshold: -12,
  },
});
const limiter = new Tone.Limiter(-20);

userOGAudio.addEventListener('change', (event) => {
  Tone.start();
  const fileURL = URL.createObjectURL(event.target.files[0]);
  player = new Tone.Player(fileURL);
  player.toDestination();
});

mutilateBtn.addEventListener('click', randomiseValues);

//FUNCTIONS --------------------------------|

function randomiseValues() {
  distortion.wet.value = Math.random();
  chorus.wet.value = Math.random();
  chorus.delayTime = Math.floor(Math.random() * 100);
  chorus.depth = Math.floor(Math.random() * 100);
  cheby.order = Math.floor(Math.random() * 100);

  addFX();
}
createButtons();
function createButtons() {
  const playSample = document.createElement('button');
  playSample.innerText = 'Play Sample';
  playSample.addEventListener('click', () => {
    player.start();
  });
  const stopSample = document.createElement('button');
  stopSample.innerText = 'Stop Sample';
  stopSample.addEventListener('click', () => {
    player.stop();
  });

  const loopLabel = document.createElement('label');
  loopLabel.htmlFor = 'loopsample';
  loopLabel.innerText = 'Loop Sample';
  const loopSample = document.createElement('input');
  loopSample.id = 'loopsample';
  loopSample.type = 'checkbox';

  newSampleDiv.appendChild(playSample);
  newSampleDiv.appendChild(stopSample);
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
    distortion,
    chorus,

    cheby,
    multiband,
    limiter
  );
}
