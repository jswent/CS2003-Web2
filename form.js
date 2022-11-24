const form = document.getElementById("crudform");

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const formHeader = document.getElementById('crudform-header');
  const formId = document.getElementById('crudform-movieid');

  let obj = {};
  obj["id"] = formId.textContent;
  obj["movie_title"] = formHeader.textContent;

  const formData = new FormData(this);
  for (const pair of formData) {
    if (pair[0] != "actors") {
      obj[pair[0]] = pair[1];
    }
  }

  const actorSplit = formData.get('actors').split(', ');
  for (let i in actorSplit) {
    let curr = "actor_" + (+i + +1) + "_name"
    obj[curr] = actorSplit[i];
  }

  console.log(obj);
  fetch('api/putMovie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj) 
  }).then(function(response) {
    return response.text();
  }).then(function(text) {
    closeForm();
    updateMovieInfo(text);
    loadTitlesInfo();
    console.log(text);
  }).catch(function(error) {
    console.log(error);
  })
})

function openForm(movie_id) {
  let parentDiv = document.getElementById("crudform-wrapper");
  parentDiv.style.display = "block";

  let form = document.getElementById("crudform");
  document.getElementById("crudform-header").contentEditable = true;

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

function closeForm() {
  document.getElementById("crudform-wrapper").style.display = "none";
}


/* Confirmation Menu */

const confirm = document.getElementById('confirm');

confirm.addEventListener('submit', function(e) {
  e.preventDefault();

  const confirmId = document.getElementById('confirm-movieid');

  deleteMovie(confirmId.textContent);

  closeConfirm();
  loadTitlesInfo();
});

function openConfirm(movie_id, confirm_text) {
  const parentDiv = document.getElementById('confirm-wrapper');
  parentDiv.style.display = "block";

  const confirmId = document.getElementById('confirm-movieid');
  const confirmText = document.getElementById('confirm-text');

  confirmId.textContent = movie_id;
  confirmText.textContent = confirm_text;
}

function closeConfirm() {
  document.getElementById('confirm-wrapper').style.display = "none";
}
