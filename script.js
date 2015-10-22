
var Utilities = {

  addClass: function(el, className) {
      if (el.classList) el.classList.add(className);
      else if (!hasClass(el, className)) el.className += ' ' + className;
  },

  removeClass: function(el, className) {
      if (el.classList) el.classList.remove(className);
      else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
  },

  loopAudio: function(audioFile) {
    audioFile.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
  }
}

// number of drops created.
var nbDrop = 200;

// function to generate a random number range.
function randRange(minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// function to generate drops
function createRain(rainAudio) {

    for (i = 1; i < nbDrop; i++) {
      var dropLeft = randRange(0, 1600);
      var dropTop = randRange(-1000, 1400);

      var rain = document.querySelector('.rain');
      rain.innerHTML = rain.innerHTML + '<div class="drop" id="drop' + i + '"></div>';

      var drop = document.querySelector('#drop' + i);
      drop.style.left = dropLeft;
      drop.style.top = dropTop;
    }

    rainAudio.play();
    Utilities.loopAudio(rainAudio);
}

var progressRadial = document.querySelector('.progress-radial');

function updateScore(count, radialOverlayText, cloudNumber) {

  var connectorID = document.querySelector('#big-to-' + cloudNumber);
  connectorID.style.display = 'block';

  switch(count) {

    case 1:
    Utilities.removeClass(progressRadial, 'progress-0');
    Utilities.addClass(progressRadial, 'progress-5');
    radialOverlayText.innerHTML = '5';
    return;

    case 2:
    Utilities.removeClass(progressRadial, 'progress-5');
    Utilities.addClass(progressRadial, 'progress-10');
    radialOverlayText.innerHTML = '10';
    return;

    case 3:
    Utilities.removeClass(progressRadial, 'progress-10');
    Utilities.addClass(progressRadial, 'progress-15');
    radialOverlayText.innerHTML = '15';
    var headerText = document.querySelector('#header-text');
    headerText.innerHTML = 'Winner!';
    var winAudio = new Audio('sounds/win.mp3');
    winAudio.play();
    return;
  }
}

function connectorFlash(cloudNumber) {

  var connectorID = document.querySelector('#big-to-' + cloudNumber);
  connectorID.style.display = 'block';

  setTimeout(function() {
    connectorID.style.display = 'none';
  }, 1000);
}

var clouds = document.querySelectorAll('.cloud-box');
for(var i=0; i < clouds.length; i++) {
  clouds[i].addEventListener('click', cloudClicked, false);
}

var errorcount = 0, correctCount = 0;
var thunderAudio = new Audio('sounds/thunder.mp3');
var rainAudio = new Audio('sounds/rain.mp3');
//var ut = new Utilities();

function cloudClicked() {

    if(errorcount != 3 && correctCount != 3) {

    var body = document.body;
    var headerText = document.querySelector('#header-text');
    var lightning = document.querySelector('#lightning');
    var rain = document.querySelector('.rain');
    var progressRadialOverlay = document.querySelector('.progress-radial .overlay');

    var cloudID = this.id;
    var cloudIDLength = cloudID.length;
    var cloudNumber = cloudID.substring(cloudIDLength - 1);

    var cloudText = document.querySelector('#' + cloudID + ' .cloud-text');
    var cloudImage = document.querySelector('#' + cloudID + ' .cloud-image');
    var answerStatus = document.querySelector('#' + cloudID + ' .answer-status');

    if(cloudID == 'cloud-1' || cloudID == 'cloud-3' || cloudID == 'cloud-4') {

      correctCount += 1;
      updateScore(correctCount, progressRadialOverlay, cloudNumber);

      cloudText.style.color = '#38D99B';
      answerStatus.style.display = 'block';
      lightning.style.display = 'none';
      body.style.backgroundColor = 'turquoise';
      rain.style.display = 'none';

      Utilities.removeClass(body, 'raining');
      Utilities.removeClass(headerText, 'raining');

      thunderAudio.pause();
      rainAudio.pause();

      progressRadialOverlay.style.backgroundColor = '#40E0D0';
      progressRadialOverlay.style.color = '#484848';

      var correctAudio = new Audio('sounds/correct.mp3');
      correctAudio.play();
    }

    else {

      errorcount += 1;
      connectorFlash(cloudNumber);

      cloudText.style.color = '#FF378E';
      answerStatus.style.display = 'block';
      lightning.style.display = 'block';

      Utilities.addClass(body, 'raining');
      Utilities.addClass(headerText, 'raining');

      rain.style.display = 'block';
      progressRadialOverlay.style.backgroundColor = '#0D343A';
      progressRadialOverlay.style.color = '#ffffff';

      thunderAudio.play();
      Utilities.loopAudio(thunderAudio);

      if(cloudID == 'cloud-5') {
        cloudImage.src = 'assets/cloud-1-dark.png';
      }
      else {
        cloudImage.src = 'assets/cloud-2-dark.png';
      }

      if(errorcount >= 2) {
        createRain(rainAudio);

        if(errorcount == 3) {
          headerText.innerHTML = 'Game over :(';
        }
      }
    }
  }
}
