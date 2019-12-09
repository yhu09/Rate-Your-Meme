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
onload = function() {
  console.log("loaded");
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
  stopButton.setAttribute("id", "stopButton");
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
    for (var key in faces) {
      var value = faces[key];
      var emotions = value["emotions"];
      // console.log(rated);
      if(!rated){
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
  document.getElementById("Clock").innerHTML =
    "Time: " + clock.toFixed(2);
}

function rateMeme(emotions) {
  console.log("A");
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
    if (clock > 2)
     rated = true;
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
    // console.log("Total Suprise:" + totalSurprise);
  } else {
    if (ticks == 0)
      return;
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
    console.log("here");
    if(rated) {
      console.log("YESITSRATED");
     const oldId = document.getElementsByClassName("meme")[0].id;
     var newId = parseInt(oldId) + 1;
    //  getRating(newId);
     rate(newId);
     showResult();
    }
  }
}

function showResult() {
  var result = document.getElementById("results");
  results.innerHTML = ("Joy: " + avgJoy + "<br /> Sadness: " + avgSadness
  + "<br />" + "Disgust: " + avgDisgust + "<br /> Anger: " + avgAnger
  + "<br /> Fear: " + avgFear + "<br /> Suprise: " + avgSurprise);
}

function reset() {
  rated = false;
}

function rate(newId) {
 request = new XMLHttpRequest();
 request.open("POST", "/rate", true);
 request.setRequestHeader('Content-Type', 'application/json');
 request.send(JSON.stringify({
   meme: newId,
   joy: avgJoy,
   sadness: avgSadness,
   disgust: avgDisgust,
   anger: avgAnger,
   fear: avgFear,
   suprise : avgSurprise,
 }));
};

// function getRating(newId) {
//   console.log("getting");
//  request = new XMLHttpRequest();
// //  request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
//  request.open("GET", "/", true);
//  request.send(newId);

//  request.onreadystatechange=function() {
//    if (this.readyState == 4 && this.status == 200) {
//      console.log(request.responseText);
//    }
//  };
// };

// function getRating(newId) {
  // $.ajax({
  //   url: '/getRating',
  //   contentType: "application/json",
  //   success: function(response) {
  //     console.log("success");
  //     console.log(response);
  //   }
  // });

  $('#stopButton').click(function() {
    $.get('/getRating', function(data, status) {
      console.log("here");
    });
  });
