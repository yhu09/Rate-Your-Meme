const button = document.getElementById("new-meme-button");
button.addEventListener("click", function(e) {
  const oldId = document.getElementsByClassName("meme")[0].id;
  var newId = parseInt(oldId) + 1;
  rate(newId);
  if (newId > 25) {
    button.disabled = true;
    button.className = "btn btn-info btn-outline disabled";
    return;
  }
  var newUrl = "Meme" + newId + ".jpg";
  var image = document.getElementsByClassName("meme")[0];
  var gifUrl = "Meme" + newId + ".gif";
  image.onerror = function() {
    this.src = gifUrl;
  };
  image.src = newUrl;
  image.id = newId;
});

function rate(newId) {
  request = new XMLHttpRequest();
  request.open("POST", "/rate", true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({
    meme: newId,
    joy: 1,
    sadness: 1,
    disgust: 1,
    contempt: 1,
    anger: 1,
    fear: 1,
    suprise : 1
  }));
};