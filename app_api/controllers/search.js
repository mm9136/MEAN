const mongoose = require("mongoose");
const Movie = mongoose.model("Movie");
const Genre = mongoose.model("Genre");

const searchMovies = (req, res) => {
    var title; 
    var genre;
    if (typeof req.query.q != "undefined" && req.query.q.trim() != "") title = req.query.q.replace("+", " ");
    if (typeof req.query.g != "undefined" && req.query.g.trim() != "") genre = req.query.g.replace("+", " ");
    if(typeof title == "undefined" && typeof genre == "undefined") return res.status(400).json({"info": "Please enter valid parameters: q=<naslov>&g=<zanr>"});
    
    if(genre == "Any" && typeof title == "undefined"){
        Movie.find().populate("genre", "_id name").exec((err, docs)=>{
            if(!docs || docs.length == 0) return res.status(404).json({"info": "There is no movie in database!"});
            else if(err) return res.status(500).json({"info": "Could not retrieve movies!"});
            else res.status(200).json({"info": docs});
        });
    }
    else if(typeof title != "undefined" && (genre == "Any" || typeof genre == "undefined"))
        Movie.find({$text: {$search: title}}).populate("genre", "_id name").limit(5).exec((err, docs)=>{
            if(!docs || docs.length == 0) return res.status(404).json({"info": "Movie not found!"});
            else if(err) return res.status(500).json({"info": "Could not retrieve movies!"});
            else res.status(200).json({"info": docs});
        });
    else if(typeof title == "undefined" && typeof genre != "undefined"){
        Movie.find({genre: genre}).populate("genre", "_id name").limit(5).exec((err, docs)=>{
            if(!docs || docs.length == 0) return res.status(404).json({"info": "Movie not found!"});
            else if(err) return res.status(500).json({"info": "Could not retrieve movies!"});
            else if(!docs.length) return res.status(404).json({"info": "Movie not found!"});
            else res.status(200).json({"info": docs});
        });
    } 
    else{
        Movie.find({$text: {$search: title}, genre: genre}).populate("genre", "_id name").limit(5).exec((err, docs)=>{
            if(!docs || docs.length == 0) return res.status(404).json({"info": "Movie not found!"});
            else if(err) return res.status(500).json({"info": "Could not retrieve movies!"});
            else if(!docs.length) return res.status(404).json({"info": "Movie not found!"});
            else res.status(200).json({"info": docs});
        });
    }
};

module.exports = {
    searchMovies
};