
// return the promise for movie titles
async function getMovieTitles() {
  return fetch('api/getMovieTitles')
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch(error => console.warn(error));
}

// return the promise for a batch of movie titles starting at lower
async function getMovieTitlesBatch(lower) {
  return fetch('api/getBatchMovieTitles/' + lower)
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(error => console.warn(error));
}

// load a batch of movie titles
async function loadMovieBatch() {
  let parentDiv = document.getElementById('movieList');
  const current_movies = hasBeenInitialized ? parentDiv.childNodes.length : 0;
  console.log(current_movies);
  let movieTitles;
  await getMovieTitlesBatch(current_movies).then(res => {
    movieTitles = res;
  });

  loadMovieList(movieTitles, false);
}

// get movie content of a specified movie by id
async function getMovieContent(id) {
  const response = await fetch('api/getMovieData/' + id)
  const content = await response.json();
  return content;
}

// parse content from json to a string for webpage
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

// create a subnav link 
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

// generate the list of genres
function generateGenreList() {
  fetch('api/getGenreList')
    .then((res) => res.json()) 
    .then((res) => {
      let genrelist = document.getElementById('genrelist');
      genrelist.innerHTML = "";
      for (const genre of res) {
        let newGenre = createSubnav(genre, 'genre-link', loadMoviesByGenre);
        genrelist.appendChild(newGenre);
      }
    })
}

// handle event for editing a movie
function handleEdit(movie_id, e) {
  // stop execution of normal event (collapse div)
  if (e && e.stopPropagation) e.stopPropagation();
  // open the form with movie_id
  openForm(movie_id);
}

// handle event for deleting a movie
function handleDelete(movie_id, movie_title, e) {
  // stop execution of normal event (collapse div)
  if (e && e.stopPropagation) e.stopPropagation();

  const confirm_text = "Delete the movie entry " + movie_title + " (id: " + movie_id + ")?";
  openConfirm(movie_id, confirm_text);
}

// load movies into the list from array provided
async function loadMovieList(movieTitles, overwrite) {
  let parentDiv = document.getElementById("movieList");
  // if movie list not yet initialised or overwrite is true, clear the movieList div
  if (!hasBeenInitialized || overwrite) {
    parentDiv.innerHTML = "";
    hasBeenInitialized = true;
  }

  for (const obj of movieTitles) {
    let id = Object.keys(obj)[0];
    let currTitle = Object.values(obj)[0];

    // create a new movie div
    let newMovie = document.createElement('div');
    newMovie.id = "movie" + id;

    // create the title box
    let movieBox = document.createElement('div');
    movieBox.className = "collapsible";
    // create an event listener to load content data on click
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

    // add movie title to box
    let movieTitle = document.createElement('p');
    movieTitle.className = "movietitle";
    movieTitle.textContent = currTitle;
    movieBox.appendChild(movieTitle);

    // add edit button to box
    let editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn', 'responsive')
    editBtn.onclick = (e) => handleEdit(id, e);
    let editIcon = document.createElement('span');
    editIcon.classList.add('icon', 'edit-icon');
    editBtn.appendChild(editIcon);
    movieBox.appendChild(editBtn);

    // add delete button to box
    let delBtn = document.createElement('button');
    delBtn.classList.add('del-btn', 'responsive');
    delBtn.onclick = (e) => handleDelete(id, currTitle, e);
    let delIcon = document.createElement('span');
    delIcon.classList.add('icon', 'del-icon');
    delBtn.appendChild(delIcon);
    movieBox.appendChild(delBtn);

    // create content box
    let movieContent = document.createElement('div');
    movieContent.className = "content";
    let contentText = document.createElement('p');
    contentText.textContent = "Waiting for JS injection...";
    movieContent.appendChild(contentText);
    newMovie.appendChild(movieBox);
    newMovie.appendChild(movieContent);

    // apend movie to list
    parentDiv.appendChild(newMovie);
  }

  // load the title info at bottom of screen
  loadTitlesInfo();
}

// add a new movie by id, same functionality as above
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
          content.style.maxHeight = "120px";
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

// load movies into list by provided genre
async function loadMoviesByGenre(genre) {
  // clear the list
  let parentDiv = document.getElementById('movieList');
  parentDiv.innerHTML = "";
  // track that is sorted by genre
  genreSet = true;
  loadAll = false;

  // get list of movies by genre
  let movies = [];
  await fetch('api/getMoviesByGenre/' + genre) 
    .then((res) => res.json())
    .then((res) => {
      movies = res; 
    })
    .catch((error) => console.warn(error));

  // load movie list with movies from genre
  loadMovieList(movies, true);

  // load titles info at bottom of screen
  loadTitlesInfo();
  // get rid of loadmore button
  document.getElementById('loadmore').style.display = "none";
}

// load all the movies in the 'database'
async function loadAllMovies() {
  // get movies array
  let movieTitles;
  await getMovieTitles().then((res) => {
    movieTitles = res;
  })
  console.log("Loading all titles");
  loadMovieList(movieTitles, true);
  loadAll = true;
  genreSet = false;
}

// update content of currently existing movie
function updateMovieInfo(movie_id) {
  console.log(movie_id);
  const parentDiv = document.getElementById("movie" + movie_id);
  if (parentDiv) {
    const children = parentDiv.children;

    const title = children[0].children[0];
    const content = children[1].children[0];
    
    // get new content from server
    const contentPromise = getMovieContent(movie_id);
    contentPromise.then((data) => {
      if (data["movie_title"] != title.textContent) {
        title.textContent = data["movie_title"];
      }
      if (children[1].style.maxHeight) {
        content.textContent = generateContentText(data);
      }
    })
  } else if (loadAll) {
    // if movie doesnt exist, add it 
    addNewMovie(movie_id);
  }
  loadTitlesInfo();
}

// delete movie by provided id
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

// load title information that displays at bottom of screen
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
      // if all movies are loaded, don't display the loadmore button
      if (res == num || genreSet) {
        loadbutton.style.display = "none";
      } else {
        loadbutton.style.display = "block";
      }
    })
}

// booleans to keep track of status
let hasBeenInitialized = false;
let genreSet = false;
let loadAll = false;

loadMovieBatch();
generateGenreList();
