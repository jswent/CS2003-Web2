const form = document.getElementById("crudform");

// add event listener for submitting form
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const formHeader = document.getElementById('crudform-header');
  const formId = document.getElementById('crudform-movieid');

  // create new json object from form contents
  let obj = {};
  obj["id"] = formId.textContent;
  obj["movie_title"] = formHeader.textContent;

  // add content to json object, will be validated by server
  const formData = new FormData(this);
  for (const pair of formData) {
    if (pair[0] != "actors") {
      obj[pair[0]] = pair[1];
    }
  }

  // add actor data, must split by commas
  const actorSplit = formData.get('actors').split(', ');
  for (let i in actorSplit) {
    let curr = "actor_" + (+i + +1) + "_name"
    obj[curr] = actorSplit[i];
  }

  console.log(obj);
  // send data to server
  fetch('api/putMovie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj) 
  }).then(function(response) {
    return response.text();
  }).then(function(text) {
    // if return is successful, update the movie info and genres list
    closeForm();
    updateMovieInfo(text);
    loadTitlesInfo();
    generateGenreList();
    console.log(text);
  }).catch(function(error) {
    console.log(error);
  })
})

// open the form
function openForm(movie_id) {
  let parentDiv = document.getElementById("crudform-wrapper");
  parentDiv.style.display = "block";

  let form = document.getElementById("crudform");
  document.getElementById("crudform-header").contentEditable = true;

  // if passed movie id load the movies contents into the form, otherwise reset it
  if (movie_id) {
    document.getElementById("crudform-movieid").textContent = movie_id;
    const contentPromise = getMovieContent(movie_id);
    contentPromise.then((data) => {
      document.getElementById("crudform-header").textContent = data["movie_title"];
      document.getElementById("inp-director").value = data["director_name"];
      document.getElementById("inp-actors").value = data["actor_1_name"] + ", " + 
        data["actor_2_name"] + ", " + data["actor_3_name"];
      document.getElementById("inp-genres").value = data["genres"];
      document.getElementById("inp-plots").value = data["plot_keywords"];
      document.getElementById("inp-link").value = data["movie_imdb_link"];
    }).catch((error) => {
      console.log(error);
      form.reset()
    })
  } else {
    form.reset();
    document.getElementById("crudform-header").textContent = "Enter movie title here";
  }
}

// close the form
function closeForm() {
  document.getElementById("crudform-wrapper").style.display = "none";
}


/* Confirmation Menu */

const confirm = document.getElementById('confirm');

// add event listener for submitting confirmation
confirm.addEventListener('submit', function(e) {
  e.preventDefault();

  const confirmId = document.getElementById('confirm-movieid');

  deleteMovie(confirmId.textContent);

  closeConfirm();
  loadTitlesInfo();
  generateGenreList();
});

// open the confirmation dialog box
function openConfirm(movie_id, confirm_text) {
  const parentDiv = document.getElementById('confirm-wrapper');
  parentDiv.style.display = "block";

  const confirmId = document.getElementById('confirm-movieid');
  const confirmText = document.getElementById('confirm-text');

  confirmId.textContent = movie_id;
  confirmText.textContent = confirm_text;
}

// close the confirmation dialog box
function closeConfirm() {
  document.getElementById('confirm-wrapper').style.display = "none";
}
