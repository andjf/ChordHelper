let chordList = [];

let wholeNotes = ["A", "B", "C", "D", "E", "F", "G"];
let sharpNotes = ["A#", "C#", "D#", "F#", "G#"];
let flatNotes = ["A♭", "B♭", "D♭", "E♭", "G♭"];

const MAX_DELAY = 10;
const MIN_DELAY = 0.5;

const RATE = 0.5;

let chordIndex;

let lastChordChangeMillis;

let startButton;
let stopButton;

let fasterButton;
let slowerButton;

let naturalNoteCheckBox;
let sharpNoteCheckBox;
let flatNoteCheckBox;

let majorCheckBox;
let minorCheckBox;

let BACKGROUND;

let isStarted;

function preload() {
  BACKGROUND = color(51);
}

let speedSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(24);
  background(BACKGROUND);

  isStarted = false;

  chordIndex = int(random(chordList.length))
  lastChordChangeMillis = 0;

  
  createStartStopButtons();
  createSpeedSlider();
  drawSliderText();
  createSpeedButtons();
  createCheckBoxes();
  
}

function createCheckBoxes() {
  let currentY = width / 50;
  let xPos = width / 50;
  let space = width / 40;
  naturalNoteCheckBox = createCheckbox(" Natural", true);
  naturalNoteCheckBox.position(xPos, currentY);
  currentY += space;
  sharpNoteCheckBox = createCheckbox(" Sharps", false);
  sharpNoteCheckBox.position(xPos, currentY);
  currentY += space;
  flatNoteCheckBox = createCheckbox(" Flats", false);
  flatNoteCheckBox.position(xPos, currentY);
  currentY += space * 2;

  majorCheckBox = createCheckbox(" Major", true);
  majorCheckBox.position(xPos, currentY);
  currentY += space;
  minorCheckBox = createCheckbox(" Minor", false);
  minorCheckBox.position(xPos, currentY);

  let boxes = [naturalNoteCheckBox, sharpNoteCheckBox, flatNoteCheckBox, majorCheckBox, minorCheckBox];
  for (let i = 0; i < boxes.length; i++) {
    let currentBox = boxes[i];
    currentBox.style("color", "white");
    currentBox.style("font-size", (15).toString() + "px");
    currentBox.style("font-family", "sans-serif");
    currentBox.changed(checkBoxChanged);
  }
  checkBoxChanged();
}

function checkBoxChanged() {
  let notes = [];
  if (naturalNoteCheckBox.checked()) {
    notes = notes.concat(wholeNotes);
  }
  if (sharpNoteCheckBox.checked()) {
    notes = notes.concat(sharpNotes);
  }
  if (flatNoteCheckBox.checked()) {
    notes = notes.concat(flatNotes);
  }

  let majorNotes = [];
  let minorNotes = [];

  for (let i = 0; i < notes.length; i++) {
    if (majorCheckBox.checked()) {
      majorNotes.push(notes[i] + " Major");
    }
    if (minorCheckBox.checked()) {
      minorNotes.push(notes[i] + " minor");
    }
  }
  
  chordList = majorNotes.concat(minorNotes);
}

function createSpeedButtons() {

  let boarderThickness = width / 300;

  fasterButton = createButton("Faster");
  fasterButton.style("width", (speedSlider.size().width / 8).toString() + "px");
  fasterButton.style("height", (speedSlider.size().height * 2).toString() + "px");
  fasterButton.position(stopButton.position().x + stopButton.size().width - fasterButton.size().width, height / 2 - fasterButton.size().height / 2);

  fasterButton.style("background-color", color(BACKGROUND));
  fasterButton.style("border", boarderThickness.toString() + "px solid white");
  fasterButton.style("color", "white");
  fasterButton.style("border-radius", (fasterButton.size().height / 5).toString() + "px");
  fasterButton.style("font-size", (fasterButton.size().height / 2).toString() + "px");
  fasterButton.style("font-family", "sans-serif");
  fasterButton.style("outline", "none");
  fasterButton.mouseOver(() => fasterButton.style("background-color", adjust(BACKGROUND, 50))).mouseOut(() => {
    fasterButton.style("background-color", color(BACKGROUND));
    fasterButton.style("color", color(255));
  });

  fasterButton.mouseClicked(() => speedSlider.value(speedSlider.value() + RATE));


  slowerButton = createButton("Slower");
  slowerButton.style("width", (speedSlider.size().width / 8).toString() + "px");
  slowerButton.style("height", (speedSlider.size().height * 2).toString() + "px");
  slowerButton.position(startButton.position().x, height / 2 - slowerButton.size().height / 2);

  slowerButton.style("background-color", color(BACKGROUND));
  slowerButton.style("border", boarderThickness.toString() + "px solid white");
  slowerButton.style("color", "white");
  slowerButton.style("border-radius", (slowerButton.size().height / 5).toString() + "px");
  slowerButton.style("font-size", (slowerButton.size().height / 2).toString() + "px");
  slowerButton.style("font-family", "sans-serif");
  slowerButton.style("outline", "none");
  slowerButton.mouseOver(() => slowerButton.style("background-color", adjust(BACKGROUND, 50))).mouseOut(() => {
    slowerButton.style("background-color", color(BACKGROUND));
    slowerButton.style("color", color(255));
  });
  slowerButton.mouseClicked(() => speedSlider.value(speedSlider.value() - RATE));

}

function adjust(col, amount) {
  let redVal = constrain(red(col) + amount, 0, 255);
  let greenVal = constrain(green(col) + amount, 0, 255);
  let blueVal = constrain(blue(col) + amount, 0, 255);
  return color(redVal, greenVal, blueVal);
}

function createSpeedSlider() {
  let speedBarBottomGap = height / 5;
  speedSlider = createSlider(0, MAX_DELAY - MIN_DELAY, 0.25 * (MAX_DELAY - 1), 0);
  speedSlider.size((stopButton.position().x + stopButton.size().width) - startButton.position().x);
  speedSlider.position(width / 2 - speedSlider.size().width / 2, startButton.position().y - speedBarBottomGap);
  speedSlider.style("-webkit-appearance", "none");
  speedSlider.style("border-radius", (speedSlider.size().height / 5).toString() + "px");
  speedSlider.style("outline", "none");
}

function drawSliderText() {
  let speedBarBottomGap = height / 5;

  textSize(speedBarBottomGap / 3);
  fill(255);
  noStroke();

  textAlign(LEFT, TOP);
  text("Slow", speedSlider.position().x, speedSlider.position().y + speedBarBottomGap / 2 - speedSlider.size().height);

  textAlign(CENTER, TOP);
  text("Medium", speedSlider.position().x + speedSlider.size().width / 2, speedSlider.position().y + speedBarBottomGap / 2 - speedSlider.size().height);

  textAlign(RIGHT, TOP);
  text("Fast", speedSlider.position().x + speedSlider.size().width, speedSlider.position().y + speedBarBottomGap / 2 - speedSlider.size().height);

}

function createStartStopButtons() {
  let buttonWidthPercentOfHalf = 0.85;
  let buttonHeightPercent = 0.2;
  let percentOfButtonHeightGap = 0.3;

  let boarderThickness = width / 100;

  startButton = createButton("Start");
  startButton.mousePressed(start);
  startButton.style("width", ((width / 2) * buttonWidthPercentOfHalf).toString() + "px");
  startButton.style("height", (height * buttonHeightPercent).toString() + "px");
  startButton.position(width / 4 - startButton.size().width / 2, height - startButton.size().height * (1 + percentOfButtonHeightGap));

  startButton.style("background-color", color(BACKGROUND));
  startButton.style("border", boarderThickness.toString() + "px solid white");
  startButton.style("color", "white");
  startButton.style("border-radius", (startButton.size().height / 5).toString() + "px");
  startButton.style("font-size", (startButton.size().height / 2).toString() + "px");
  startButton.style("font-family", "sans-serif");
  startButton.style("outline", "none");
  startButton.mouseOver(() => startButton.style("background-color", adjust(BACKGROUND, 50))).mouseOut(() => {
    startButton.style("background-color", color(BACKGROUND));
    startButton.style("color", color(255));
  });

  //----------------------//

  stopButton = createButton("Stop");
  stopButton.mousePressed(stop);
  stopButton.style("width", ((width / 2) * buttonWidthPercentOfHalf).toString() + "px");
  stopButton.style("height", (height * buttonHeightPercent).toString() + "px");
  stopButton.position(3 * width / 4 - stopButton.size().width / 2, height - stopButton.size().height * (1 + percentOfButtonHeightGap));
  stopButton.style("background-color", color(BACKGROUND));
  stopButton.style("border", boarderThickness.toString() + "px solid white");
  stopButton.style("color", "white");
  stopButton.style("border-radius", (stopButton.size().height / 5).toString() + "px");
  stopButton.style("font-size", (stopButton.size().height / 2).toString() + "px");
  stopButton.style("font-family", "sans-serif");
  stopButton.style("outline", "none");
  stopButton.mouseOver(() => stopButton.style("background-color", adjust(BACKGROUND, 50))).mouseOut(() => {
    stopButton.style("background-color", color(BACKGROUND));
    stopButton.style("color", color(255));
  });

}

function start() {
  isStarted = true;
  lastChordChangeMillis = millis();

  stopButton.style("background-color", color(BACKGROUND));
  stopButton.style("color", color(255));

  startButton.style("background-color", color(255));
  startButton.style("color", color(0));
}

function stop() {
  isStarted = false;

  stopButton.style("background-color", color(255));
  stopButton.style("color", color(0));

  startButton.style("background-color", color(BACKGROUND));
  startButton.style("color", color(255));
}

function draw() {
  background(BACKGROUND);
  drawSliderText();
  textAlign(CENTER, BOTTOM);
  textSize(50);
  text(isStarted ? (chordList.length == 0 ? "Check Boxes to Enable Chords" : chordList[chordIndex]) : "Click Start", width / 2, height / 3.5);
  textSize(20);
  text("Speed: " + map(speedSlider.value(), 0, MAX_DELAY - MIN_DELAY, 0, 100).toFixed(1) + "%\t(" + (MAX_DELAY - speedSlider.value()).toFixed(1) + " seconds between each)", width / 2, height / 2);

  if ((millis() - lastChordChangeMillis) / 1000 > (MAX_DELAY - speedSlider.value())) {
    chordIndex = int(random(chordList.length))
    lastChordChangeMillis = millis();
  }
}
