const mongoose = require("mongoose");
const DVD = mongoose.model("DVD");

const getAll = (req, res)=>{
    var min_q = req.query.minq;
    DVD.find(typeof min_q != "undefined" ? {quantity:{$gt: min_q}} : {}).populate({path: "movies", options: {select: "_id imdb_id title year description"}}).exec((err, docs)=>{
        if(!docs.length) return res.status(404).json({"info": "There is no DVD in database"});
        else if(err) return res.status(500).json({"info": "Could not retrieve DVDs!"});
        else res.status(200).json({"info": docs});
    });
};
const getById = (req, res)=>{
    DVD.findById(req.params.dvd_id).populate("movies", "_id imdb_id title year description").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no DVD with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve DVD!"});
        else res.status(200).json({"info": docs});
    });
};

const getDVDMovies = (req, res)=>{
    DVD.findById(req.params.dvd_id).select("movies").populate("movies", "_id imdb_id title year description").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no DVD with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve DVD!"});
        else res.status(200).json({"info": docs.movies});
    });  
};

const add = (req, res)=>{
    var dvd = {};
    if(typeof req.body.name != "undefined" && req.body.name.trim() != "") dvd.name = req.body.name;
    else return res.status(400).json({"info":"DVD name is necessary!"});
    if(typeof req.body.price != "undefined" && req.body.price >= 0) dvd.price = req.body.price;
    else return res.status(400).json({"info":"DVD price is necessary!"});
    if(typeof req.body.quantity != "undefined" && req.body.quantity > 0) dvd.quantity = req.body.quantity;
    else return res.status(400).json({"info":"DVD quantity is necessary!"});
    if(typeof req.body.movies != "undefined" && req.body.movies.length > 0) dvd.movies = req.body.movies;
    else return res.status(400).json({"info":"There must be at least one movie on DVD!"});
    if(typeof req.body.description != "undefined" && req.body.description.trim() != "") dvd.description = req.body.description;
    DVD.findOne({"name": dvd.name}).exec((err, docs)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve DVD!"});
        else if(!docs) { // add dvd
            DVD.create(dvd, (err, n)=>{
                if(err) return res.status(500).json({"info": "Could not create DVD!"});
                else res.status(201).json({"info": n});
            });
        } else return res.status(400).json({"info": "There is already a DVD with this name!"});
    });
};

const update = (req, res)=>{
    var _id = req.params.dvd_id;
    var body = req.body; 
    var name = body.name;
    var movies = body.movies;
    var quantity = body.quantity;
    var price = body.price;
    var description = body.description;
    
    DVD.findById(_id).exec((err, d)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve DVD!"});
        else if(!d) return res.status(404).json({"info": "There is no DVD with this id!"});
        else {
            if(typeof name != "undefined" && name.trim() != "") d.name = name;
            if(typeof quantity != "undefined" && quantity > 0) d.quantity = quantity;
            if(typeof price != "undefined" && price >= 0) d.price = price;
            if(typeof movies != "undefined" && movies.length > 0) d.movies = movies;
            if(typeof req.body.description != "undefined" && req.body.description.trim() != "") d.description = description;
            d.save((err)=>{
                if(err) return res.status(500).json({"info": "Could not save DVD!"});
                res.status(200).json({"info": d});
            });
        }
    });
};


const updateQuantity = (req, res)=>{
    var _id = req.query.dvd_id;
    var quantity = req.query.quantity;
    var op = req.query.operation;
    console.log(_id);
    DVD.findById(_id).exec((err, d)=>{
        if(err) return res.status(500).json({"info": "Could not retrieve DVD!"});
        else if(!d) return res.status(404).json({"info": "There is no DVD with this id!"});
        else {
            if(op == 1){
                d.quantity = d.quantity + parseInt(quantity);
                d.save((err)=>{
                    if(err) return res.status(500).json({"info": "Could not save DVD!"});
                    res.status(200).json({"info:": d});
                }); 
            }else if(op == 0){
                    d.quantity = d.quantity - parseInt(quantity);
                    d.save((err)=>{
                        if(err) return res.status(405).json({"info": "There is no enough DVDs!"});
                        res.status(200).json({"info:": d});
                    });
              
            }
         
        }
    });
};

const remove = (req, res)=>{
    console.log("remove");
    DVD.findById(req.params.dvd_id).exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no DVD with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve DVD!"});
        else {
            docs.remove((err)=>{
                if(err) return res.status(500).json({"info": "Could not remove DVD!"});
                else res.status(204).json({"info": "Success"});
            });
        }
    });
};

module.exports = {
    getAll,
    getById,
    getDVDMovies,
    add,
    update,
    remove,
    updateQuantity
};