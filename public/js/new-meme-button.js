const button = document.getElementById("new-meme-button");
button.addEventListener("click", function(e) {
  const oldId = document.getElementsByClassName("meme")[0].id;
  var newId = parseInt(oldId) + 1;
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

