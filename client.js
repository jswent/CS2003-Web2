
async function getMovieTitles() {
  return fetch('api/getMovieTitles')
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch(error => console.warn(error));
}

async function getMovieTitlesBatch(lower) {
  return fetch('api/getBatchMovieTitles/' + lower)
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(error => console.warn(error));
}

async function getMovieContent(id) {
  const response = await fetch('api/getMovieData/' + id)
  const content = await response.json();
  return content;
}

function generateContentText(data) {
  let text = "";

  let director = "Director: " + data["director_name"] + "\r\n";
  let actors = "Actors: " + data["actor_1_name"] + ", " + 
    data["actor_2_name"] + ", " + data["actor_3_name"] + "\r\n";
  let genres = "Genres: ";
  if (data["genres"]) {
    let genresArr = data["genres"].split("|");
    genresArr.forEach(element => {
      genres += element + ", "; 
    });
    genres = genres.slice(0, -2) + "\r\n";
  } else {
    genres += "\r\n";
  }
  let plot = "Plot Keywords: ";
  if (data["plot_keywords"]) {
    let plotArr = data["plot_keywords"].split("|");
    plotArr.forEach(element => {
      plot += element + ", ";
    })
    plot = plot.slice(0, -2) + "\r\n";
  } 
  plot += "\r\n";

  text = director + actors + genres + plot;
  return text;
}

function createSubnav(text, className, onclick) {
  let subnavItem = document.createElement('li');
  subnavItem.className = "subnav_item";

  let a = document.createElement('a');
  a.className = className;
  a.textContent = text;
  a.onclick = () => onclick(text);

  subnavItem.appendChild(a);
  
  return subnavItem;
}

function generateGenreList() {
  fetch('api/getGenreList')
    .then((res) => res.json()) 
    .then((res) => {
      let genrelist = document.getElementById('genrelist');
      for (const genre of res) {
        let newGenre = createSubnav(genre, 'genre-link', loadMoviesByGenre);
        genrelist.appendChild(newGenre);
      }
    })
}

function handleEdit(movie_id, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  openForm(movie_id);
}

function handleDelete(movie_id, movie_title, e) {
  if (e && e.stopPropagation) e.stopPropagation();

  const confirm_text = "Delete the movie entry " + movie_title + " (id: " + movie_id + ")?";
  openConfirm(movie_id, confirm_text);
}

async function loadMovieList() {
  let parentDiv = document.getElementById("movieList");
  if (!hasBeenInitialized) {
    parentDiv.innerHTML = "";
    hasBeenInitialized = true;
  }

  const current_movies = parentDiv.childNodes.length;
  let movieTitles;
  await getMovieTitlesBatch(current_movies).then(res => {
    movieTitles = res;
  });

  for (const obj of movieTitles) {
    let id = Object.keys(obj)[0];
    let currTitle = Object.values(obj)[0];

    let newMovie = document.createElement('div');
    newMovie.id = "movie" + id;

    let movieBox = document.createElement('div');
    movieBox.className = "collapsible";
    movieBox.addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        console.log(id);
        const contentPromise = getMovieContent(id);
        contentPromise.then((data) => {
          contentText.textContent = generateContentText(data);

          let contentLink = document.createElement('a');
          contentLink.className = "movie-link";
          contentLink.textContent = "IMDb Link";
          if (data["movie_imdb_link"]) contentLink.href = data["movie_imdb_link"];
          contentText.appendChild(contentLink);
        });
        console.log(content.scrollHeight);
        // content.style.maxHeight = content.scrollHeight + "px";
        content.style.maxHeight = "120px";
      }
    })

    let movieTitle = document.createElement('p');
    movieTitle.className = "movietitle";
    movieTitle.textContent = currTitle;
    movieBox.appendChild(movieTitle);

    let editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn', 'responsive')
    editBtn.onclick = (e) => handleEdit(id, e);

    let editIcon = document.createElement('span');
    editIcon.classList.add('icon', 'edit-icon');

    editBtn.appendChild(editIcon);
    movieBox.appendChild(editBtn);

    let delBtn = document.createElement('button');
    delBtn.classList.add('del-btn', 'responsive');
    delBtn.onclick = (e) => handleDelete(id, currTitle, e);

    let delIcon = document.createElement('span');
    delIcon.classList.add('icon', 'del-icon');

    delBtn.appendChild(delIcon);
    movieBox.appendChild(delBtn);

    let movieContent = document.createElement('div');
    movieContent.className = "content";

    let contentText = document.createElement('p');
    contentText.textContent = "Waiting for JS injection...";
    movieContent.appendChild(contentText);

    newMovie.appendChild(movieBox);
    newMovie.appendChild(movieContent);

    parentDiv.appendChild(newMovie);
  }

  loadTitlesInfo();
}

function addNewMovie(id) {
  fetch('api/getMovieTitle/' + id)
    .then((res) => res.text())
    .then((res) => {
      const parentDiv = document.getElementById('movieList');
      let newMovie = document.createElement('div');
      newMovie.id = "movie" + id;

      let movieBox = document.createElement('div');
      movieBox.className = "collapsible";
      movieBox.addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          console.log(id);
          const contentPromise = getMovieContent(id);
          contentPromise.then((data) => {
            contentText.textContent = generateContentText(data);

            let contentLink = document.createElement('a');
            contentLink.className = "movie-link";
            contentLink.textContent = "IMDb Link";
            if (data["movie_imdb_link"]) contentLink.href = data["movie_imdb_link"];
            contentText.appendChild(contentLink);
          });
          console.log(content.scrollHeight);
          // content.style.maxHeight = content.scrollHeight + "px";
          content.style.maxHeight = "100px";
        }
      })

      let movieTitle = document.createElement('p');
      movieTitle.className = "movietitle";
      movieTitle.textContent = res;
      movieBox.appendChild(movieTitle);

      let editBtn = document.createElement('button');
      editBtn.classList.add('edit-btn', 'responsive')
      editBtn.onclick = (e) => handleEdit(id, e);

      let editIcon = document.createElement('span');
      editIcon.classList.add('icon', 'edit-icon');

      editBtn.appendChild(editIcon);
      movieBox.appendChild(editBtn);

      let delBtn = document.createElement('button');
      delBtn.classList.add('del-btn', 'responsive');
      delBtn.onclick = (e) => handleDelete(id, res, e);

      let delIcon = document.createElement('span');
      delIcon.classList.add('icon', 'del-icon');

      delBtn.appendChild(delIcon);
      movieBox.appendChild(delBtn);

      let movieContent = document.createElement('div');
      movieContent.className = "content";

      let contentText = document.createElement('p');
      contentText.textContent = "Waiting for JS injection...";
      movieContent.appendChild(contentText);

      newMovie.appendChild(movieBox);
      newMovie.appendChild(movieContent);

      parentDiv.appendChild(newMovie);
    })
}

async function loadMoviesByGenre(genre) {
  let parentDiv = document.getElementById('movieList');
  parentDiv.innerHTML = "";
  genreSet = true;

  let movies = [];
  await fetch('api/getMoviesByGenre/' + genre) 
    .then((res) => res.json())
    .then((res) => {
      movies = res; 
    })
    .catch((error) => console.warn(error));

  for (const obj of movies) {
    addNewMovie(Object.keys(obj)[0]);
  }

  loadTitlesInfo();
  document.getElementById('loadmore').style.display = "none";
}

function updateMovieInfo(movie_id) {
  console.log(movie_id);
  const parentDiv = document.getElementById("movie" + movie_id);
  if (parentDiv) {
    const children = parentDiv.children;

    const title = children[0].children[0];
    const content = children[1].children[0];
    
    const contentPromise = getMovieContent(movie_id);
    contentPromise.then((data) => {
      if (data["movie_title"] != title.textContent) {
        title.textContent = data["movie_title"];
      }

      if (children[1].style.maxHeight) {
        content.textContent = generateContentText(data);
      }
    })
  } else {
    addNewMovie(movie_id);
  }
  loadTitlesInfo();
}

function deleteMovie(id) {
  fetch('api/deleteMovie/' + id)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const movieId = "movie" + id;
      document.getElementById(movieId).outerHTML = "";
    })
    .catch((err) => {
      console.error(err);
    })
}

function loadTitlesInfo() {
  fetch('api/getMovieCount')
    .then((res) => res.text())
    .then((res) => {
      const current = document.getElementById('current-titles');
      const total = document.getElementById('all-titles');

      const num = document.getElementById('movieList').childNodes.length;

      current.textContent = num;
      total.textContent = res;

      const loadbutton = document.getElementById('loadmore');
      if (res == num || genreSet) {
        loadbutton.style.display = "none";
      } else {
        loadbutton.style.display = "block";
      }
    })
}

hasBeenInitialized = false;
genreSet = false;
loadMovieList();
generateGenreList();
