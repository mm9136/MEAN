const mongoose = require("mongoose");
const Bill = mongoose.model("Bill");
const DVD = mongoose.model("DVD");
const Movie = mongoose.model("Movie");
const Genre = mongoose.model("Genre");
const User = mongoose.model('User');

const deleteAll = function(req, res){
    
    DVD
    .deleteMany({})
    .exec(function(napaka, DVDs){
        if(napaka){
            res.status(404).json(napaka);
            return;
        }
    })
    
    Genre
    .deleteMany({})
    .exec(function(napaka, Genres){
        if(napaka){
            res.status(404).json(napaka);
            return;
        }
    })
    
    Bill
    .deleteMany({})
    .exec(function(napaka, Bills){
        if(napaka){
            res.status(404).json(napaka);
            return;
        }
    })
    
    Movie
    .deleteMany({})
    .exec(function(napaka, Movies){
        if(napaka){
            res.status(404).json(napaka);
            return;
        }
    })
    
    User
    .deleteMany({})
    .exec(function(napaka, Users){
        if(napaka){
            res.status(404).json(napaka);
            return;
        }
    })
    
    res.status(204).json("Success");
    
    
    
};
const user_data_json = require("./users.json");
const genre_data_json = require("./genre.json");
const movies_data_json = require("./movies.json");
const dvd_data_json = require("./dvd.json");

const addAll = function(req, res){
    var user_data = JSON.parse(JSON.stringify(user_data_json));
    var genre_data = JSON.parse(JSON.stringify(genre_data_json));
    var movies_data = JSON.parse(JSON.stringify(movies_data_json));
    var dvd_data = JSON.parse(JSON.stringify(dvd_data_json));
    
    User.insertMany(
        user_data, function(napaka,data) {
            if (napaka) {
              res.status(400).json(napaka);
            } 
      });
   Genre.insertMany(
        genre_data, function(napaka,data_g) {
             if (napaka) {
                res.status(400).json(napaka);
            } else{
                for(var i=0; i<movies_data.length; i++){
                    for(var j = 0; j<data_g.length; j++){
                        if(movies_data[i].genre == data_g[j].name){
                            movies_data[i].genre = data_g[j]._id;
                        }
                    }
                }
                Movie.insertMany(movies_data, function(napaka, data) {
                     if (napaka) res.status(400).json(napaka);
                     else{
                        for(var i=0; i<data.length; i++){
                            for(var j = 0; j<data_g.length; j++){
                                if(data[i].genre == data_g[j]._id){
                                    data_g[j].movies.push(data[i]._id)
                                }
                             }
                        }
                        for(var j = 0; j<data_g.length; j++){
                            data_g[j].save((err)=>{
                                if(err) return res.status(500).json({"info": err});
                            });
                        }
                        var dvds = [];
                        
                       
                      
                            for(var j = 0; j<dvd_data.length; j++){
                                var dvd = {};
                                dvd.name = dvd_data[j].name;
                                dvd.price = dvd_data[j].price;
                                dvd.quantity = dvd_data[j].quantity;
                                dvd.movies = [];
                                for(var k = 0; k< dvd_data[j].movies.length;k++){
                                   for(var i=0; i<data.length; i++){
                                       if(data[i].imdb_id == dvd_data[j].movies[k].imdb_id){
                                            dvd.movies.push(data[i]._id);
                                        }
                                    }
                                }
                            dvds.push(dvd);
                        }
                                    
                        DVD.insertMany(dvds, function(napaka,data_d) {
                            if (napaka) res.status(400).json(napaka);
                        
                        }); 
                     }
                });
            }
    });
      
     
    res.status(201).json("Success");
};

module.exports = {
  deleteAll,
  addAll
};