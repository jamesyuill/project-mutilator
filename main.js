import * as Tone from 'tone';

let player;

//DOM QUERIES --------------------------------|
const userOGAudio = document.getElementById('userOGAudio');
const ogSampleDiv = document.getElementById('ogsample');
const bypassDistortion = document.querySelector('#dist-bypass');
const bypassChorus = document.querySelector('#chorus-bypass');
const bypassCrusher = document.querySelector('#crush-bypass');
const dryWetDistSlider = document.getElementById('dry-wet-dist-slider');

const distortion = new Tone.Distortion({
  wet: 1,
  distortion: 1,
});
const chorus = new Tone.Chorus({
  wet: 1,
  delayTime: 100,
  depth: 100,
});
const crusher = new Tone.BitCrusher({
  wet: 1,
  depth: 2,
});

userOGAudio.addEventListener('change', (event) => {
  Tone.start();
  const fileURL = URL.createObjectURL(event.target.files[0]);
  player = new Tone.Player(fileURL);
  createButtons();
  // createCheckboxMenu();
  addFX();
});

bypassDistortion.addEventListener('change', bypassEffect.bind(distortion));
bypassChorus.addEventListener('change', bypassEffect.bind(chorus));
bypassCrusher.addEventListener('change', bypassEffect.bind(crusher));
dryWetDistSlider.addEventListener('input', (e) => {
  let value = e.target.value / 100;
  distortion.wet.value = value;
});

function bypassEffect(e) {
  if (e.target.checked) {
    this.wet.value = 0;
  } else {
    this.wet.value = 1;
  }
}

//FUNCTIONS --------------------------------|

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

  ogSampleDiv.appendChild(playSample);
  ogSampleDiv.appendChild(stopSample);
  ogSampleDiv.appendChild(loopLabel);
  ogSampleDiv.appendChild(loopSample);

  loopSample.addEventListener('change', (e) => {
    if (e.target.checked) {
      player.loop = true;
    } else {
      player.loop = false;
    }
  });
}

// function createCheckboxMenu() {
//   const distLabel = document.createElement('label');
//   distLabel.htmlFor = 'distbox';
//   distLabel.innerText = 'Distortion';
//   const distBox = document.createElement('input');
//   distBox.type = 'checkbox';
//   distBox.id = 'distbox';

//   documentFragment.appendChild(listItem);
//   listItem.appendChild(distLabel);
//   listItem.appendChild(distBox);
//   // listItem.appendChild(editButton);
//   // listItem.appendChild(deleteButton);
//   checkBoxDiv.appendChild(documentFragment);
// }

function addFX() {
  Tone.Destination.chain(distortion, chorus, crusher);
  player.toDestination();
}
