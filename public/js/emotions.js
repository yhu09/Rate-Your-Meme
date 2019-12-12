var detector;
var clock = 0;
var timer;
var memeNum = 1;
var starttime;
var endtime;
var engaged = false;
var totalJoy = 0;
var totalSadness = 0;
var totalDisgust = 0;
var totalAnger = 0;
var totalFear = 0;
var totalSurprise = 0;
var ticks = 0;
var rated = false;
var avgJoy = 0;
var avgSadness = 0;
var avgDisgust = 0;
var avgAnger = 0;
var avgFear = 0;
var avgsurprise = 0;
var started = false;
// var theRatings;
onload = function() {
  var container = document.createElement("div");
  container.id = "affdex_elements";
  document.body.appendChild(container);
  document.getElementById("affdex_elements").style.display = "none";

  var divRoot = document.getElementById("affdex_elements");
  var width = 640;
  var height = 480;
  var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

  detector = new affdex.CameraDetector(divRoot, 0, 0, faceMode);

  // var startButton = document.createElement("BUTTON");
  // startButton.innerHTML = "Start";
  // startButton.onclick = function() {
  //   detector.start();
  // };
  //
  // document.body.appendChild(startButton);

  var stopButton = document.createElement("BUTTON");
  stopButton.innerHTML = "Stop";
  stopButton.onclick = function() {
    detector.stop();
    clearInterval(timer);
  };

  document.body.appendChild(stopButton);

  detector.detectAllExpressions();
  detector.detectAllEmotions();
  detector.detectAllEmojis();
  detector.detectAllAppearance();

  detector.addEventListener("onInitializeSuccess", function() {});
  detector.addEventListener("onInitializeFailure", function() {});
  detector.addEventListener("onWebcamConnectSuccess", function() {});
  detector.addEventListener("onWebcamConnectFailure", function() {});
  detector.addEventListener("onImageResultsSuccess", function(
    faces,
    image,
    timestamp
  ) {
    /* camera starts working */
    if (!started) {
      var img = document.getElementsByClassName("meme")[0];
      var newUrl = "Meme1.jpg";
      var gifUrl = "Meme1.gif";
      img.onerror = function() {
        this.src = gifUrl;
      };
      img.src = newUrl;
      img.id = "1";
      started = true;

      var memeButton = document.getElementById("new-meme-button");
      memeButton.style.display = "";
      var loadingSymbol = document.getElementById("loading-symbol");
      loadingSymbol.style.display = "none";
      // memeButton.innerHTML =
      //   "<button id='new-meme-button' type='button' class='btn btn-default btn-outline btn-lg' onclick='reset()'>Gimme a new meme!</button>";
    }

    for (var key in faces) {
      var value = faces[key];
      var emotions = value["emotions"];
      // console.log(rated);
      if (!rated) {
        rateMeme(emotions);
        // console.log(emotions);
      }
    }
  });
  detector.addEventListener("onImageResultsFailure", function(
    image,
    timestamp,
    err_detail
  ) {});
  detector.addEventListener("onStopSuccess", function() {});
  detector.addEventListener("onStopFailure", function() {});
};

function clockTick() {
  clock = clock + 0.01;
  document.getElementById("Clock").innerHTML = "Time: " + clock.toFixed(2);
}

function mathify(average, value, views) {
  return average = average + ((value - average) / views);
};

function rateMeme(emotions) {
  var engagement = emotions.engagement;
  if (engagement > 50 && !engaged) {
    totalJoy = 0;
    totalSadness = 0;
    totalDisgust = 0;
    totalAnger = 0;
    totalFear = 0;
    totalSurprise = 0;
    engaged = true;
    timer = setInterval(clockTick, 10);
    starttime = clock;
  } else if (engagement < 50 && engaged) {
    engaged = false;
    endtime = clock;
    clearInterval(timer);
    if (clock > 0.3) rated = true;
    clock = 0;
  }
  if (engaged) {
    ticks++;
    // console.log("Joy: " + emotions.joy);
    // console.log("Ticks: " + ticks);
    totalJoy += emotions.joy;
    totalSadness += emotions.sadness;
    totalDisgust += emotions.disgust;
    totalAnger += emotions.anger;
    totalFear += emotions.fear;
    totalSurprise += emotions.surprise;
    // console.log("Total Joy:" + totalJoy);
    // console.log("Total Sadness:" + totalSadness);
    // console.log("Total Disgust:" + totalDisgust);
    // console.log("Total Anger:" + totalAnger);
    // console.log("Total Fear:" + totalFear);
    // console.log("Total surprise:" + totalSurprise);
  } else {
    if (ticks == 0) return;
    interval = endtime - starttime;
    avgJoy = (totalJoy / ticks).toFixed(2);
    avgSadness = (totalSadness / ticks).toFixed(2);
    avgDisgust = (totalDisgust / ticks).toFixed(2);
    avgAnger = (totalAnger / ticks).toFixed(2);
    avgFear = (totalFear / ticks).toFixed(2);
    avgSurprise = (totalSurprise / ticks).toFixed(2);
    // console.log("Interval: " + interval);
    // console.log("Average Joy: " + avgJoy);
    // console.log("Average Sadness: " + avgSadness);
    // console.log("Average Disgust: " + avgDisgust);
    ticks = 0;
    if (rated) {
      const oldId = document.getElementsByClassName("meme")[0].id;
      var newId = parseInt(oldId) + 1;
      console.log("getting");
      request = new XMLHttpRequest();
      var memeQuery = "/meme?meme=" + oldId;

      request.open("GET", memeQuery, true);
      request.setRequestHeader("Content-Type", "application/json");
      request.send(memeQuery);
      request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var theRatings = request.responseText;
          var theRatingsData = JSON.parse(theRatings);
          var firstElem = theRatingsData[0]; //not sure which one I was supposed to use, the array had a length of 2
          var joyRating = firstElem.joy;
          var sadRating = firstElem.sadness;
          var disgustRating = firstElem.disgust;
          var angerRating = firstElem.anger;
          var fearRating = firstElem.fear;
          var surpriseRating = firstElem.surprise;
          var views = firstElem.views;
          var ratingsDisplay = document.getElementById("avgResults");
          ratingsDisplay.innerHTML =
            "Joy: " +
            joyRating +
            "<br /> Sadness: " +
            sadRating +
            "<br />" +
            "Disgust: " +
            disgustRating +
            "<br /> Anger: " +
            angerRating +
            "<br /> Fear: " +
            fearRating +
            "<br /> Surprise: " +
            surpriseRating;
        }
        rate(oldId, joyRating, sadRating, disgustRating, angerRating, fearRating, surpriseRating, views);
        showResult();
      };
    }
  }
}

function showResult() {
  var yourButton = document.getElementById("your-results-btn-span");
  yourButton.innerHTML =
    "<button type='button' class='btn btn-outline btn-info' data-toggle='modal' data-target='#userResultsModal' style='color: rgb(211, 152, 113); text-shadow: none;'>Your Results</button>";
  var result = document.getElementById("results");
  results.innerHTML =
    "Joy: " +
    avgJoy +
    "<br /> Sadness: " +
    avgSadness +
    "<br />" +
    "Disgust: " +
    avgDisgust +
    "<br /> Anger: " +
    avgAnger +
    "<br /> Fear: " +
    avgFear +
    "<br /> Surprise: " +
    avgSurprise;
}

function reset() {
  rated = false;
}


function rate(id, joyRating, sadRating, disgustRating, angerRating, fearRating, surpriseRating, views) {
  // var theRatingsData = JSON.parse(theRatings);
  // console.log(theRatingsData);
  // var firstElem = theRatingsData[0];
  // // var memeId = firstElem.meme;
  // var joyRating = firstElem.joy;
  // var sadRating = firstElem.sadness;
  // var disgustRating = firstElem.disgust;
  // var angerRating = firstElem.anger;
  // var fearRating = firstElem.fear;
  // var surpriseRating = firstElem.surprise;
  // var viewCount = firstElem.views + 1;
  viewCount = views + 1;

  request = new XMLHttpRequest();
  request.open("PUT", "/rate", true);
  request.setRequestHeader("Content-Type", "application/json");
  // request.send(
  //   JSON.stringify({
  //     meme: id,
  //     joy: avgJoy,
  //     sadness: avgSadness,
  //     disgust: avgDisgust,
  //     anger: avgAnger,
  //     fear: avgFear,
  //     surprise: avgSurprise
  //   })
  request.send(
    JSON.stringify({
      meme: id,
      joy: mathify(joyRating, avgJoy, viewCount),
      sadness: mathify(sadRating, avgSadness, viewCount),
      disgust: mathify(disgustRating, avgDisgust, viewCount),
      anger: mathify(angerRating, avgAnger, viewCount),
      fear: mathify(fearRating, avgFear, viewCount),
      surprise: mathify(surpriseRating, avgSurprise, viewCount),
      views: viewCount
    })
  );
  console.log("response:");
  console.log(request.responseText);
};
