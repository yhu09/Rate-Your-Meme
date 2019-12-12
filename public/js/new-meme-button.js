const button = document.getElementById("new-meme-button");
button.addEventListener("click", function(e) {
  const oldId = document.getElementsByClassName("meme")[0].id;
  var newId = parseInt(oldId) + 1;
  var image = document.getElementsByClassName("meme")[0];

  if (newId > 25) {
    var imgContainer = document.getElementById("meme-container");
    var resultsButtons = document.getElementById("results-buttons");
    var memeButtonDiv = document.getElementById("new-meme-button-div");
    imgContainer.innerHTML = "<div>No more memes!</div>";
    resultsButtons.innerHTML = "";
    memeButtonDiv.innerHTML = "";

    return;
  }
  var newUrl = "Meme" + newId + ".jpg";
  var gifUrl = "Meme" + newId + ".gif";
  image.onerror = function() {
    this.src = gifUrl;
  };
  image.src = newUrl;
  image.id = newId;
  var close_your_results_button = document.getElementById("close-your-results");
  var close_avg_results_button = document.getElementById("close-avg-results");
  close_your_results_button.click();
  close_avg_results_button.click();
  var yourButton = document.getElementById("your-results-btn-span");
  yourButton.innerHTML =
    "<img class='loading-symbol' src='loading.gif' alt='Image not found'/>";
  var compareButton = document.getElementById("avg-results-btn-span");
  compareButton.innerHTML =
    "<img class='loading-symbol' src='loading.gif' alt='Image not found'/>";
});
