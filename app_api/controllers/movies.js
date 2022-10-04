const axios = require("axios");
/* var apiParams = {
    omdb: "https://www.omdbapi.com/?apikey=e9217139&type=movie&r=json",
} */
const mongoose = require("mongoose");
const Movie = mongoose.model("Movie");
const Genre = mongoose.model("Genre");
const Dvd = mongoose.model("DVD");

const getAll = (req, res)=>{
    Movie.estimatedDocumentCount((err, count) => {
        if(err) return res.status(500).json({"info": "Could not retrieve movies!"});
        const offset = req.query.offset || 0;
        const limit = req.query.limit;
        Movie.find().sort("title").skip(parseInt(offset)).limit(parseInt(limit)).populate("genre", "_id name").exec((err, docs)=>{
            if(!docs.length ) return res.status(404).json({"info": "There is no movie in database!"});
            else if(err) return res.status(500).json({"info": "Could not retrieve movies!"});
            else res.set("X-Total-Count", count).status(200).json({"info": docs, "count": count});
        });
    });
    
};

const getById = (req, res)=>{
    Movie.findById(req.params.movie_id).populate("genre", "_id name").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no movie with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else res.status(200).json({"info": docs});
    });
};

const getMovieGenre = (req, res)=>{
    Movie.findById(req.params.movie_id).populate("genre", "_id name").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no movie with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else res.status(200).json({"info": docs.genre});
    });
};

const getMovieDetails = (req, res)=>{
    var imdb_id = req.query.i;
    var title = (typeof req.query.t == "undefined") ? undefined : req.query.t.replace("+", " ");
    var year = req.query.y;

    if(typeof imdb_id != "undefined" && imdb_id.trim() != "") getFromIMDBID(req, res, imdb_id);
    else if(typeof title != "undefined" && title.trim() != "" && typeof year != "undefined" && year.trim() != "") getFromTitleYear(req, res, title, year);
    else if(typeof title != "undefined" && title.trim() != "") getFromTitle(req, res, title);
    else res.status(400).json({"info": "Ni primernih parametrov"});
};

const add = (req, res)=>{
    var body = req.body;
    var imdb_id = body.imdb_id;
    var title = body.title;
    var year = body.year;
    var genre = body.genre;
    var description = body.description;

    var movie = {};
    if(typeof imdb_id != "undefined" && imdb_id.trim() != "") movie.imdb_id = imdb_id;
    else return res.status(400).json({"info":"Movie IMDB id is necessary! "});
    if(typeof title != "undefined" && title.trim() != "") movie.title = title;
    else return res.status(400).json({"info":"Movie title  is necessary!"});
    if(typeof year != "undefined" && year > 0) movie.year = year;
    else return res.status(400).json({"info":"Movie year is necessary!"});

    Movie.findOne(movie).exec((err, t)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else if(!t) {
            // nov film
            if(typeof genre != "undefined" && genre.trim() != "") {
                if(typeof description != "undefined" && description.trim() != "") movie.description = description;
                else return res.status(400).json({"info":"Movie description  is necessary!"});
                Genre.findOne({"name": genre}).exec((err, docs)=>{
                    if(err) return res.status(500).json({"info": "Could not retrieve genre!"});
                    else if(!docs) {
                        // new genre
                        Genre.create({name: genre}, (err, gen)=>{
                            if(err) return res.status(500).json({"info": "Could not create genre!"});
                            movie.genre = gen._id;
                            Movie.create(movie, (err, n)=>{
                                if(err) return res.status(500).json({"info": "Could not create movie!"});
                                gen.movies.push(n._id);
                                gen.save((err)=>{
                                    if(err) return res.status(500).json({"info": "Could not save genre!"});
                                    else res.status(201).json({"info": n});
                                });
                            });
                        });
                    } else {
                        // old genre
                        movie.genre = docs._id;
                        Movie.create(movie, (err, n)=>{
                            if(err) return res.status(500).json({"info": "Could not create movie!"});
                            else {
                                docs.movies.push(n._id);
                                docs.save((err)=>{
                                    if(err) return res.status(500).json({"info": "Could not save genre!"});
                                    else res.status(201).json({"info": n});
                                });
                            }
                        });
                    }
                });
            } else res.status(400).json({"info":"Movie genre  is necessary!"});
        } else res.status(400).json({"info": "Already exists in database"});
    });
};

const update = (req, res)=>{
    var _id = req.params.movie_id; //console.log("id");
    var body = req.body; //console.log("body");
    var imdb_id = body.imdb_id; //console.log("imdb");
    var title = body.title; //console.log("title");
    var year = body.year; //console.log("year");
    var genre = body.genre; //console.log("genre");
    var description = body.description; //console.log("description");
    
    var movie = {};
    if(typeof imdb_id != "undefined" && imdb_id.trim() != "") movie.imdb_id = imdb_id;
    if(typeof title != "undefined" && title.trim() != "") movie.title = title;
    if(typeof year != "undefined" && year > 0) movie.year = year;
    if(typeof genre != "undefined" && genre.trim() != "") movie.genre = genre;
    if(typeof description != "undefined" && description.trim() != "") movie.description = description;
    
    //console.log("---------"+movie);
    
    Movie.findById(_id).exec((err, t)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else if(!t) return res.status(400).json({"info": "There is no movie with this id!!"});
        else {
            if(typeof movie.imdb_id != "undefined" && movie.imdb_id.trim() != "") t.imdb_id = movie.imdb_id;
            if(typeof movie.title != "undefined" && movie.title.trim() != "") t.title = movie.title;
            if(typeof movie.year != "undefined" && movie.year > 0) t.year = movie.year;
            if(typeof movie.description != "undefined" && movie.description.trim() != "") t.description = movie.description;
            if(typeof movie.genre != "undefined" && movie.genre.trim() != "") {
                if(!movie.genre == t.genre) {
                    console.log("Genre new");
                    Genre.findById(t.genre).exec((err, ogen)=>{ // get old genre id
                        if(err) return res.status(500).json({"info": "Could not retrieve genre!"});
                        const index = ogen.movies.indexOf(t._id);
                        if (index > -1) {
                          ogen.movies.splice(index, 1);         // remove movie from list in old genre
                        }
                        if(ogen.movies.length == 0) {
                            ogen.remove((err)=>{
                                if(err) return res.status(500).json({"info": "Could not remove genre!"});
                                updateGenreAndMovie(res, t, ogen, genre);
                            });
                        } else updateGenreAndMovie(res, t, ogen, genre);
                    });
                } else {
                    t.save((err)=>{
                        if(err) return res.status(500).json({"info": "Could not save movie!"});
                        else res.status(200).json({"info": t});
                    });
                }
            }
        }
    });
};

const remove = (req, res)=>{
    Dvd.find({movies: req.params.movie_id}).exec((err, docs)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve DVDs!"});
        if(!docs || docs.length == 0) removeMovie(req, res, req.params.movie_id);
        else return res.status(400).json({"info": "Cannot delete because some DVDs still contain this movie."});
    });
};

function updateGenreAndMovie(res, t, ogen, genre) {
    ogen.save((err)=>{
        if(err) return res.status(500).json({"info": "Could not save genre!"});
        Genre.findOne({"name": genre}).exec((err, docs)=>{ // find new genre
            if(err) return res.status(500).json({"info": "Could not retrieve genre!"});
            else if(!docs) {
                // new genre
                Genre.create({"name": genre, "movies": [t._id]}, (err, ngen)=>{ // create new genre and add movie id to it
                    if(err) return res.status(500).json({"info": "Could not create genre!"});
                    t.genre = ngen._id;        // add new genre id to movie
                    t.save((err)=>{         // save movie
                        if(err) return res.status(500).json({"info": "Could not save movie!"}); 
                        else res.status(200).json({"info": t});
                    }); 
                });
            } else {
                // old genre
                t.genre = ogen._id; 
                docs.movies.push(t._id);
                docs.save((err)=>{
                    if(err) return res.status(500).json({"info": "Could not save genre!"});
                    else t.save((err)=>{
                        if(err) return res.status(500).json({"info": "Could not save movie!"});
                        else res.status(200).json({"info": t});
                    });
                });
            }
        });
    });
}

function getFromIMDBID(req, res, id) {
    Movie.findOne({imdb_id: id}).populate("genre", "_id name").exec((err, docs)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else if(!docs) {
            return res.status(404).json({"info": "OMDB"});
            /* axios.get(apiParams.omdb, {
                params: {
                    i: id
                }
            }).then((obj)=>{
                var data = obj.data;
                if(data.Response=="False") return res.status(404).json({"info": data.Error});
                var movie = {
                    imdb_id: id,
                    title: data.Title,
                    year: data.Year,
                    genre: data.Genre,
                    description: data.Plot
                };
                res.status(200).json({"info": movie}); //if 200 use post
            }).catch((error)=>{
                return res.status(502).json({"info": error});
            }); */
        } else {
            var movie = {
                _id: docs._id,
                imdb_id: docs.imdb_id,
                title: docs.title,
                year: docs.year,
                genre: docs.genre.name,
                description: docs.description
            };
            res.status(201).json({"info": movie}); //if 201 already in db, when saving use put
        }
    });
}

function getFromTitleYear(req, res, t, y) {
    Movie.findOne({$text: {$search: t}, year: y}).populate("genre", "_id name").exec((err, docs)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else if(!docs) {
            return res.status(404).json({"info": "OMDB"});
            /* axios.get(apiParams.omdb, {
                params: {
                    t: t,
                    y: y
                }
            }).then((obj)=>{
                var data = obj.data;
                var movie = {
                    imdb_id: data.imdbID,
                    title: data.Title,
                    year: data.Year,
                    genre: data.Genre,
                    description: data.Plot
                };
                res.status(200).json({"info": movie}); //if 200 use post
            }).catch((error)=>{
                res.status(502).json({"info": error});
            }); */
        } else {
            var movie = {
                _id: docs._id,
                imdb_id: docs.imdb_id,
                title: docs.title,
                year: docs.year,
                genre: docs.genre.name,
                description: docs.description
            };
            res.status(201).json({"info": movie}); //if 201 already in db, when saving use put
        }
    });
}

function getFromTitle(req, res, t) {
    Movie.findOne({$text: {$search: t}}).populate("genre", "_id name").exec((err, docs)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else if(!docs) {
            return res.status(404).json({"info": "OMDB"});
            /* axios.get(apiParams.omdb, {
                params: {
                    t: t
                }
            }).then((obj)=>{
                var data = obj.data;
                var movie = {
                    imdb_id: data.imdbID,
                    title: data.Title,
                    year: data.Year,
                    genre: data.Genre,
                    description: data.Plot
                };
                res.status(200).json({"info": movie}); //if 200 use post
            }).catch((error)=>{
                res.status(502).json({"info": error});
            }); */
        } else {
            var movie = {
                _id: docs._id,
                imdb_id: docs.imdb_id,
                title: docs.title,
                year: docs.year,
                genre: docs.genre.name,
                description: docs.description
            };
            res.status(201).json({"info": movie}); //if 201 already in db, when saving use put
        }
    });
}

function removeMovie(req, res, id) {
    Movie.findById(id).exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no movie with this id!!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve movie!"});
        else {
            Genre.findById(docs.genre).exec((err, gen)=>{
                if(!gen) res.status(204).json({"info": "Success!"});
                else if(err) return res.status(500).json({"info": "Could not retrieve genre!"});
                else {
                    const index = gen.movies.indexOf(docs._id);
                    if (index > -1) {
                      gen.movies.splice(index, 1);         // remove movie from list in genre
                    }
                    docs.remove((err)=>{
                        if(err) return res.status(500).json({"info": "Could not remove movie!"});
                        else if(gen.movies.length == 0) {
                            gen.remove((err)=> {            // remove if there are no movies of that genre
                                if(err) return res.status(500).json({"info": "Could not remove genre!"}); 
                                else res.status(204).json({"info": "Success!"});
                            });
                        } else {
                            gen.save((err)=>{
                                if(err) return res.status(500).json({"info": "Could not save genre!"});
                                else res.status(204).json({"info": "Success!"});
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    getAll,
    getById,
    getMovieGenre,
    getMovieDetails,
    add,
    update,
    remove
};