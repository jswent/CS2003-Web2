const express = require('express');
const fs = require('fs');

// use express with json parser
const app = express();
app.use(express.json());

// change this to use different datafile
const DATAFILE = "./data/movie_metadata_subset.json"

// change the filename in the function to load different dataset
var movieData = loadMovieData(DATAFILE);

// return array with contents of file as objects
function loadMovieData(filename) {
  let file = fs.readFileSync(filename, 'utf-8');
  var obj = JSON.parse(file);

  return obj;
}

// write movieData to file
function writeMovieData(filename) {
  fs.writeFile(filename, JSON.stringify(movieData, null, 2), err => {
    if (err) {
      console.error(err);
    }
  })
}

// create array of objects with just id and titles
function getMovieTitles() {
  var titles = [];
  for (let i in movieData) {
    const obj = {};
    obj[movieData[i]["id"]] = movieData[i]["movie_title"];
    titles.push(obj);
  }
  return titles;
}

// generates a batch of movie titles from the index provided
function generateMovieTitlesBatch(lower) {
  let higher = Number(lower) + 20;
  if (higher > movieData.length) {
    higher = movieData.length;
  }

  let titles = [];

  for (let i = lower; i < higher; i++) {
    let obj = {};
    obj[movieData[i]["id"]] = movieData[i]["movie_title"];
    titles.push(obj);
  }

  return titles;
}

// create a new movie object from the body of the post request
function generateNewMovie(body) {
  const obj = {};

  const id = movieData[movieData.length-1]["id"]+1;
  obj["id"] = id;
  addObjectPair(obj, body, "movie_title");
  addObjectPair(obj, body, "director_name");
  addObjectPair(obj, body, "actor_1_name");
  addObjectPair(obj, body, "actor_2_name");
  addObjectPair(obj, body, "actor_3_name");
  addObjectPair(obj, body, "genres");
  addObjectPair(obj, body, "plot_keywords");
  addObjectPair(obj, body, "movie_imdb_link");

  return obj;
}

// add the content to the object if it exists
function addObjectPair(obj, body, key) {
  if (body[key]) {
    obj[key] = body[key];
  } else {
    obj[key] = "";
  }
}

// loops through all objects and creates a list of genres
function generateGenreList() {
  let arr = [];

  for (let obj of movieData) {
    if (obj["genres"]) {
      const genreSplit = obj["genres"].split("|");
      for (let genre of genreSplit) {
        if (!arr.includes(genre)) {
          arr.push(genre);
        }
      }
    }
  }
  return arr;
}

// find all movies that contain the provided genre
function findMoviesByGenre(genre) {
  let movies = movieData.filter(movie => {
    let genreSplit = movie.genres.split("|")
    return genreSplit.includes(genre);
  })

  let arr = [];

  for (const obj of movies) {
    let newObj = {};
    newObj[obj["id"]] = obj["movie_title"];
    arr.push(newObj);
  }
  return arr;
}

/* SERVE FILES */
app.get('/', (req, res) => {
  console.log('Received request for main.html');
  res.sendFile(__dirname + '/main.html');
});

app.get('/client.js', (req, res) => {
  console.log('Received request for client.js');
  res.sendFile(__dirname + '/client.js');
});

app.get('/form.js', (req, res) => {
  console.log('Received request for form.js');
  res.sendFile(__dirname + '/form.js');
})

app.get('/dark-mode.js', (req, res) => {
  console.log('Received request for dark-mode.js');
  res.sendFile(__dirname + '/dark-mode.js');
})

app.get('/style.css', (req, res) => {
  console.log('Received request for styles');
  res.sendFile(__dirname + '/style.css');
});

app.get('/assets/edit.png', (req, res) => {
  console.log('Received request for assets');
  res.sendFile(__dirname + '/assets/edit.png');
})

app.get('/assets/theme-dark.svg', (req, res) => {
  console.log('Received request for assets');
  res.sendFile(__dirname + '/assets/theme-dark.svg');
})

app.get('/assets/theme-light.svg', (req, res) => {
  console.log('Received request for assets');
  res.sendFile(__dirname + '/assets/theme-light.svg');
})

app.get('/assets/theme-os.svg', (req, res) => {
  console.log('Received request for assets');
  res.sendFile(__dirname + '/assets/theme-os.svg');
})

app.get('/assets/delete.svg', (req, res) => {
  console.log('Received request for assets');
  res.sendFile(__dirname + '/assets/delete.svg');
})

/* API */
app.get('/api/getMovieTitles', (req, res) => {
  console.log('Received request for movie titles');
  res.send(JSON.stringify(getMovieTitles()));
});

app.get('/api/getBatchMovieTitles/:lower', (req, res) => {
  console.log('Received request for movie titles batch from ' + req.params.lower);
  res.send(JSON.stringify(generateMovieTitlesBatch(req.params.lower)));
})

app.get('/api/getMovieTitle/:id', (req, res) => {
  let movie = movieData.find(movie => movie["id"] == req.params.id) ;
  if (!movie) res.status(404).send("The movie with the given id could not be found");
  res.send(movie["movie_title"]);
})

app.get('/api/getMovieCount', (req, res) => {
  console.log('Received request for movie count');
  res.status(200).send(String(movieData.length));
})

app.get('/api/getMovieData/:id', (req, res) => {
  let movieContent = movieData.find(movie => movie["id"] == req.params.id) ;
  if (!movieContent) res.status(404).send("The movie with the given id could not be found");
  res.send(movieContent);
})

app.post('/api/putMovie', (req, res) => {
  const id = req.body["id"];
  let movie = movieData.find(movie => movie["id"] == id)
  if (movie) {
    console.log('Received edit request for ' + movie["movie_title"]);
    for (let key in req.body) {
      // implement validity check
      if (req.body[key] != movie[key]) {
        console.log("modifying " + key);
        movie[key] = req.body[key];
      }
    }
  } else {
    console.log("Creating new movie " + req.body["movie_title"]);
    movie = generateNewMovie(req.body);
    console.log(movie);
    movieData.push(movie);
  }
  res.send("" + movie["id"]);
  res.end()

  writeMovieData(DATAFILE);
})

app.get('/api/deleteMovie/:id', (req, res) => {
  let index = movieData.findIndex(movie => movie["id"] == req.params.id) ;
  if (index == -1) res.status(404).send("The movie with the given id could not be found");
  console.log("Deleting movie at " + index);
  let result = !!movieData.splice(index, 1);
  res.status(200).send(result);

  writeMovieData(DATAFILE);
})

app.get('/api/getGenreList', (req, res) => {
  console.log('Received request for genre list');
  let genres = generateGenreList();
  res.send(JSON.stringify(genres));
})

app.get('/api/getMoviesByGenre/:genre', (req, res) => {
  console.log('Received request for movies in ' + req.params.genre);
  let genres = generateGenreList();
  if (!genres.includes(req.params.genre)) res.status(404).send("The genre could not be found");
  let movies = findMoviesByGenre(req.params.genre);
  res.send(JSON.stringify(movies));
})

const port = process.getuid()
// const port = 8080;
app.listen(port, () => console.log('Listening at port: ' + port));
