const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

// change the filename in the function to load different dataset
var movieData = loadMovieData("./data/movie_metadata_subset.json");

function loadMovieData(filename) {
  let file = fs.readFileSync(filename, 'utf-8');
  var obj = JSON.parse(file);

  return obj;
}

function getMovieTitles() {
  var titles = [];
  for (let i in movieData) {
    const obj = {};
    obj[movieData[i]["id"]] = movieData[i]["movie_title"];
    titles.push(obj);
  }
  return titles;
}

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

function generateNewMovie(body) {
  const obj = {};

  const id = movieData[movieData.length-1]["id"]+1;
  obj["id"] = id;
  addObjectPair(obj, body, "movie_title");
  addObjectPair(obj, body, "director_name");
  addObjectPair(obj, body, "actor_1_name");
  addObjectPair(obj, body, "actor_2_name");
  addObjectPair(obj, body, "actor_3_name");
  addObjectPair(obj, body, "gennres");
  addObjectPair(obj, body, "plot_keywords");

  return obj;
}

function addObjectPair(obj, body, key) {
  if (body[key]) {
    obj[key] = body[key];
  } else {
    obj[key] = "";
  }
}

/* SERVE FILES */
app.get('/', (req, res) => {
  console.log('Received request');
  res.sendFile(__dirname + '/main.html');
});

app.get('/client.js', (req, res) => {
  console.log('Received request');
  res.sendFile(__dirname + '/client.js');
});

app.get('/form.js', (req, res) => {
  console.log('Received request');
  res.sendFile(__dirname + '/form.js');
})

app.get('/style.css', (req, res) => {
  console.log('Received request');
  res.sendFile(__dirname + '/style.css');
});

app.get('/assets/edit.png', (req, res) => {
  console.log('Received request');
  res.sendFile(__dirname + '/assets/edit.png');
})

app.get('/assets/delete.svg', (req, res) => {
  console.log('Received request');
  res.sendFile(__dirname + '/assets/delete.svg');
})

/* API */
app.get('/api/getMovieTitles', (req, res) => {
  console.log('Received request');
  res.send(JSON.stringify(getMovieTitles()));
});

app.get('/api/getBatchMovieTitles/:lower', (req, res) => {
  console.log('Received request');
  res.send(JSON.stringify(generateMovieTitlesBatch(req.params.lower)));
})

app.get('/api/getMovieTitle/:id', (req, res) => {
  let movie = movieData.find(movie => movie["id"] == req.params.id) ;
  if (!movie) res.status(404).send("The movie with the given id could not be found");
  res.send(movie["movie_title"]);
})

app.get('/api/getMovieCount', (req, res) => {
  console.log('Received request');
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
    for (let key in req.body) {
      // implement validity check
      if (req.body[key] != movie[key]) {
        console.log("modifying " + key);
        movie[key] = req.body[key];
      }
    }
  } else {
    movie = generateNewMovie(req.body);
    console.log(movie);
    movieData.push(movie);
  }
  res.send("" + movie["id"]);
  res.end()
})

app.get('/api/deleteMovie/:id', (req, res) => {
  let index = movieData.findIndex(movie => movie["id"] == req.params.id) ;
  if (index == -1) res.status(404).send("The movie with the given id could not be found");
  let result = !!movieData.splice(index, 1);
  res.status(200).send(result);
})

// const port = process.getuid()
const port = 8080;
app.listen(port, () => console.log('Listening at port: ' + port));
