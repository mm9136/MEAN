const mongoose = require("mongoose");
const Genre = mongoose.model("Genre");

const getAll = (req, res)=>{
    Genre.estimatedDocumentCount((err, count) => {
        if(err) return res.status(500).json({"info": "Could not retrieve genres!"});
        const offset = req.query.offset || 0;
        const limit = req.query.limit;
        Genre.find().sort("name").select("_id name movies").skip(parseInt(offset)).limit(parseInt(limit)).populate("movies", "_id imdb_id title year description").exec((err, docs)=>{
            if(!docs.length) return res.status(404).json({"info": "There is no genre in database"});
            else if(err) return res.status(500).json({"info": "Could not retrieve genres!"});
            else {res.set("X-Total-Count", count).status(200).json({"info": docs, "count": count});}
        });
    });
};

const getById = (req, res)=>{
    Genre.findById(req.params.genre_id).populate("movies", "_id imdb_id title year description").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no genre with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve genre!"});
        else res.status(200).json({"info": docs});
    });
};

const getGenreMovies = (req, res)=>{
    Genre.findById(req.params.genre_id).select("movies").populate("movies", "_id imdb_id title year description").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no genre with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve genre!"});
        else res.status(200).json({"info": docs.movies});
    });  
};

const add = (req, res) => {
    var body = req.body; 
    var name = body.genre.name;
    if(typeof name == "undefined" && name.trim() == "") return res.status(400).json({"info":"Genre name is necessary!"});
    Genre.create({"name":name, "movies": []}, (err, docs)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve genre!"});
        else return res.status(201).json({"info": docs});
    });
}

module.exports = {
    getAll,
    getById,
    getGenreMovies,
    add
};