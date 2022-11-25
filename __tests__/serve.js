const fs = require('fs');

describe('Get movie titles', () => {
  test('it should return the ids and movies contained within movieData', () => {
    const movieData = generateSampleMovies();

    const output = [
      { 1: 'Avatar' },
      { 2: "Pirates of the Caribbean: At World's End" },
      { 3: 'Spectre' },
      { 4: 'The Dark Knight Rises' },
      { 5: 'Star Wars: Episode VII - The Force Awakens' },
    ];

    expect(getMovieTitles(movieData)).toEqual(output);
  });

  test('it should return the ids and movies contained within movieData for the first 20 instances', () => {
    const movieData = loadMovieData('./data/movie_metadata_subset.json');

    const output = [
      { 1: 'Avatar' },
      { 2: "Pirates of the Caribbean: At World's End" },
      { 3: 'Spectre' },
      { 4: 'The Dark Knight Rises' },
      { 5: 'Star Wars: Episode VII - The Force Awakens' },
      { 6: 'John Carter' },
      { 7: 'Spider-Man 3' },
      { 8: 'Tangled' },
      { 9: 'Avengers: Age of Ultron' },
      { 10: 'Harry Potter and the Half-Blood Prince' },
      { 11: 'Batman v Superman: Dawn of Justice' },
      { 12: 'Superman Returns' },
      { 13: 'Quantum of Solace' },
      { 14: "Pirates of the Caribbean: Dead Man's Chest" },
      { 15: 'The Lone Ranger' },
      { 16: 'Man of Steel' },
      { 17: 'The Chronicles of Narnia: Prince Caspian' },
      { 18: 'The Avengers' },
      { 19: 'Pirates of the Caribbean: On Stranger Tides' },
      { 20: 'Men in Black 3' },
    ];

    expect(generateMovieTitlesBatch(movieData, 0)).toEqual(output);
  });

  test('it should return a batch of 20 movies after the 15th position', () => {
    const movieData = loadMovieData('./data/movie_metadata_subset.json');

    const output = [
      { 16: 'Man of Steel' },
      { 17: 'The Chronicles of Narnia: Prince Caspian' },
      { 18: 'The Avengers' },
      { 19: 'Pirates of the Caribbean: On Stranger Tides' },
      { 20: 'Men in Black 3' },
      { 21: 'The Hobbit: The Battle of the Five Armies' },
      { 22: 'The Amazing Spider-Man' },
      { 23: 'Robin Hood' },
      { 24: 'The Hobbit: The Desolation of Smaug' },
      { 25: 'The Golden Compass' },
      { 26: 'King Kong' },
      { 27: 'Titanic' },
      { 28: 'Captain America: Civil War' },
      { 29: 'Battleship' },
      { 30: 'Jurassic World' },
      { 31: 'Skyfall' },
      { 32: 'Spider-Man 2' },
      { 33: 'Iron Man 3' },
      { 34: 'Alice in Wonderland' },
      { 35: 'X-Men: The Last Stand' },
    ];

    expect(generateMovieTitlesBatch(movieData, 15)).toEqual(output);
  });

  test('return a batch of movies from a position where there are less than 20 left', () => {
    const movieData = loadMovieData('./data/movie_metadata_subset.json');

    const output = [
      { 94: 'Terminator 3: Rise of the Machines' },
      { 95: 'Guardians of the Galaxy' },
      { 96: 'Interstellar' },
      { 97: 'Inception' },
      { 98: 'Godzilla Resurgence' },
      { 99: 'The Hobbit: An Unexpected Journey' },
      { 100: 'The Fast and the Furious' },
    ];

    expect(generateMovieTitlesBatch(movieData, 93)).toEqual(output);
  });
});

describe('test the genre functionality', () => {
  test('generate list of genres', () => {
    const movieData = loadMovieData('./data/movie_metadata_subset.json');

    const output = [
      'Action',
      'Adventure',
      'Fantasy',
      'Sci-Fi',
      'Thriller',
      'Documentary',
      'Romance',
      'Animation',
      'Comedy',
      'Family',
      'Musical',
      'Mystery',
      'Western',
      'Drama',
      'History',
      'Sport',
      'Crime',
      'Horror',
    ];

    expect(generateGenreList(movieData)).toEqual(output);
  });

  test('find all movies in the romance genre', () => {
    const movieData = loadMovieData('./data/movie_metadata_subset.json');

    const output = [
      { 7: 'Spider-Man 3' },
      { 8: 'Tangled' },
      { 26: 'King Kong' },
      { 27: 'Titanic' },
      { 32: 'Spider-Man 2' },
      { 51: 'The Great Gatsby' },
      { 52: 'Prince of Persia: The Sands of Time' },
      { 64: 'The Legend of Tarzan' },
      { 82: 'Maleficent' },
      { 84: 'The Lovers' },
    ];

    expect(findMoviesByGenre(movieData, "Romance")).toEqual(output);
  });
});

function generateSampleMovies() {
  let sample = [
    {
      id: 1,
      director_name: 'James Cameron',
      actor_2_name: 'Joel David Moore',
      genres: 'Action|Adventure|Fantasy|Sci-Fi',
      actor_1_name: 'CCH Pounder',
      movie_title: 'Avatar',
      actor_3_name: 'Wes Studi',
      plot_keywords: 'avatar|future|marine|native|paraplegic',
      movie_imdb_link: 'http://www.imdb.com/title/tt0499549/?ref_=fn_tt_tt_1',
    },
    {
      id: 2,
      director_name: 'Gore Verbinski',
      actor_2_name: 'Orlando Bloom',
      genres: 'Action|Adventure|Fantasy',
      actor_1_name: 'Johnny Depp',
      movie_title: "Pirates of the Caribbean: At World's End",
      actor_3_name: 'Jack Davenport',
      plot_keywords:
        'goddess|marriage ceremony|marriage proposal|pirate|singapore',
      movie_imdb_link: 'http://www.imdb.com/title/tt0449088/?ref_=fn_tt_tt_1',
    },
    {
      id: 3,
      director_name: 'Sam Mendes',
      actor_2_name: 'Rory Kinnear',
      genres: 'Action|Adventure|Thriller',
      actor_1_name: 'Christoph Waltz',
      movie_title: 'Spectre',
      actor_3_name: 'Stephanie Sigman',
      plot_keywords: 'bomb|espionage|sequel|spy|terrorist',
      movie_imdb_link: 'http://www.imdb.com/title/tt2379713/?ref_=fn_tt_tt_1',
    },
    {
      id: 4,
      director_name: 'Christopher Nolan',
      actor_2_name: 'Christian Bale',
      genres: 'Action|Thriller',
      actor_1_name: 'Tom Hardy',
      movie_title: 'The Dark Knight Rises',
      actor_3_name: 'Joseph Gordon-Levitt',
      plot_keywords:
        'deception|imprisonment|lawlessness|police officer|terrorist plot',
      movie_imdb_link: 'http://www.imdb.com/title/tt1345836/?ref_=fn_tt_tt_1',
    },
    {
      id: 5,
      director_name: 'Doug Walker',
      actor_2_name: 'Rob Walker',
      genres: 'Documentary',
      actor_1_name: 'Doug Walker',
      movie_title: 'Star Wars: Episode VII - The Force Awakens',
      actor_3_name: '',
      plot_keywords: '',
      movie_imdb_link: 'http://www.imdb.com/title/tt5289954/?ref_=fn_tt_tt_1',
    },
  ];

  return sample;
}

function loadMovieData(filename) {
  let file = fs.readFileSync(filename, 'utf-8');
  var obj = JSON.parse(file);

  return obj;
}

function writeMovieData(filename) {
  fs.writeFile(filename, JSON.stringify(movieData, null, 2), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function getMovieTitles(movieData) {
  var titles = [];
  for (let i in movieData) {
    const obj = {};
    obj[movieData[i]['id']] = movieData[i]['movie_title'];
    titles.push(obj);
  }
  return titles;
}

function generateMovieTitlesBatch(movieData, lower) {
  let higher = Number(lower) + 20;
  if (higher > movieData.length) {
    higher = movieData.length;
  }

  let titles = [];

  for (let i = lower; i < higher; i++) {
    let obj = {};
    obj[movieData[i]['id']] = movieData[i]['movie_title'];
    titles.push(obj);
  }

  return titles;
}

function generateNewMovie(body) {
  const obj = {};

  const id = movieData[movieData.length - 1]['id'] + 1;
  obj['id'] = id;
  addObjectPair(obj, body, 'movie_title');
  addObjectPair(obj, body, 'director_name');
  addObjectPair(obj, body, 'actor_1_name');
  addObjectPair(obj, body, 'actor_2_name');
  addObjectPair(obj, body, 'actor_3_name');
  addObjectPair(obj, body, 'genres');
  addObjectPair(obj, body, 'plot_keywords');

  return obj;
}

function addObjectPair(obj, body, key) {
  if (body[key]) {
    obj[key] = body[key];
  } else {
    obj[key] = '';
  }
}

function generateGenreList(movieData) {
  let arr = [];

  for (let obj of movieData) {
    if (obj['genres']) {
      const genreSplit = obj['genres'].split('|');
      for (let genre of genreSplit) {
        if (!arr.includes(genre)) {
          arr.push(genre);
        }
      }
    }
  }
  return arr;
}

function findMoviesByGenre(movieData, genre) {
  let movies = movieData.filter((movie) => {
    let genreSplit = movie.genres.split('|');
    return genreSplit.includes(genre);
  });

  let arr = [];

  for (const obj of movies) {
    let newObj = {};
    newObj[obj['id']] = obj['movie_title'];
    arr.push(newObj);
  }
  return arr;
}
