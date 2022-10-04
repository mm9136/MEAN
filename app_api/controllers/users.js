const mongoose = require('mongoose');
const User = mongoose.model('User');

const getAll = (req, res)=>{
    User.find().exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no user in database"});
        else if(err) return res.status(500).json({"info": "Could not retrieve users!"});
        else res.status(200).json({"info": docs});
    });
};

const getById = (req, res)=>{
    User.findById(req.params.user_id).populate("bills").exec((err, docs)=>{
        if(!docs) return res.status(404).json({"info": "There is no user with this id!"});
        else if(err) return res.status(500).json({"info": "Could not retrieve user!"});
        else res.status(200).json({"info": docs});
    });
};

const addUser = (req, res) => {
    //ce ze obstaja uporabnik s tem email-om
    var userSega = User.findOne({email : req.body.email}, function(napaka, data){
        if (data) {
            res.status(401).json({
                "message" : "User with this email already exists!"
            });
        }
        else {
            User.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                admin: false
            }, (napaka, data) => {
                if (napaka) {
                    res.status(400).json(napaka);
                }
                else {
                    res.status(201).json(data);
                }
            });
        }
    });
};



module.exports = {
    getAll,
    getById,
    addUser
};