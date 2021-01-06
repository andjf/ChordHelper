let chordList = ["A Major", "A minor",
  "B Major", "B minor",
  "C Major", "C minor",
  "D Major", "D minor",
  "E Major", "E minor",
  "F Major", "F minor",
  "G Major", "G minor",
  "A# Major", "A# minor",
  "C# Major", "C# minor",
  "D# Major", "D# minor",
  "F# Major", "F# minor",
  "G# Major", "G# minor",
  "A♭ Major", "A♭ minor",
  "B♭ Major", "B♭ minor",
  "D♭ Major", "D♭ minor",
  "E♭ Major", "E♭ minor",
  "G♭ Major", "G♭ minor",
];

const MAX_DELAY = 10;
const MIN_DELAY = 0.5;

let chordIndex;

let lastChordChangeMillis;

let startButton;
let stopButton;

let BACKGROUND;

let isStarted;

function preload() {
  BACKGROUND = color(33, 146, 181);
}

let speedSlider;

function setup() {
  createCanvas(640, 360);
  textSize(24);
  background(BACKGROUND);
  
  isStarted = false;

  chordIndex = int(random(chordList.length))
  lastChordChangeMillis = 0;

  createStartStopButtons();
  createSpeedSlider();
  drawSliderText();
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
  startButton.position(width / 4 - startButton.width / 2, height - startButton.height * (1 + percentOfButtonHeightGap));

  startButton.style("background-color", color(BACKGROUND));
  startButton.style("border", boarderThickness.toString() + "px solid white");
  startButton.style("color", "white");
  startButton.style("border-radius", (startButton.height / 5).toString() + "px");
  startButton.style("font-size", (startButton.height / 2).toString() + "px");
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
  stopButton.position(3 * width / 4 - stopButton.width / 2, height - stopButton.height * (1 + percentOfButtonHeightGap));

  stopButton.style("background-color", color(BACKGROUND));
  stopButton.style("border", boarderThickness.toString() + "px solid white");
  stopButton.style("color", "white");
  stopButton.style("border-radius", (stopButton.height / 5).toString() + "px");
  stopButton.style("font-size", (stopButton.height / 2).toString() + "px");
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
  text(isStarted ? chordList[chordIndex] : "Click Start", width / 2, height / 3);
  textSize(20);
  text("Speed: " + map(speedSlider.value(), 0, MAX_DELAY - MIN_DELAY, 0, 100).toFixed(1) + "%\t(" + (MAX_DELAY - speedSlider.value()).toFixed(1) + " seconds between each)", width / 2, height / 2);

  if ((millis() - lastChordChangeMillis) / 1000 > (MAX_DELAY - speedSlider.value())) {
    chordIndex = int(random(chordList.length))
    lastChordChangeMillis = millis();
  }
}