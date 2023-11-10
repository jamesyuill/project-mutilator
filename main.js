import * as Tone from 'tone';

let player;

//DOM QUERIES --------------------------------|
const userOGAudio = document.getElementById('userOGAudio');
const ogSampleDiv = document.getElementById('ogsample');
const checkBoxDiv = document.getElementById('checkboxmenu');
const listItem = document.createElement('li');
const documentFragment = document.createDocumentFragment();

const distortion = new Tone.Distortion(0.8);

userOGAudio.addEventListener('change', (event) => {
  Tone.start();
  const fileURL = URL.createObjectURL(event.target.files[0]);
  player = new Tone.Player(fileURL);
  createButtons();
  createCheckboxMenu();
  player.connect(distortion);
  distortion.toDestination();
});

//FUNCTIONS --------------------------------|

function createButtons() {
  const playSample = document.createElement('button');
  playSample.innerText = 'Play OG Sample';
  playSample.addEventListener('click', () => {
    player.start();
  });
  const stopSample = document.createElement('button');
  stopSample.innerText = 'Stop OG Sample';
  stopSample.addEventListener('click', () => {
    player.stop();
  });

  ogSampleDiv.appendChild(playSample);
  ogSampleDiv.appendChild(stopSample);
}

function createCheckboxMenu() {
  const distLabel = document.createElement('label');
  distLabel.htmlFor = 'distbox';
  distLabel.innerText = 'Distortion';
  const distBox = document.createElement('input');
  distBox.type = 'checkbox';
  distBox.id = 'distbox';

  documentFragment.appendChild(listItem);
  listItem.appendChild(distLabel);
  listItem.appendChild(distBox);
  // listItem.appendChild(editButton);
  // listItem.appendChild(deleteButton);
  checkBoxDiv.appendChild(documentFragment);
}
