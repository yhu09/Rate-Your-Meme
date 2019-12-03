const button = document.getElementById("new-meme-button");
button.addEventListener("click", function(e) {
  const oldId = document.getElementsByClassName("meme")[0].id;
  var newId = parseInt(oldId) + 1;
  if (newId > 25) return;
  var newUrl = "Meme" + newId + ".jpg";
  var image = document.getElementsByClassName("meme")[0];
  image.src = newUrl;
  image.id = newId;
});
