const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

const changePassword = (req, res)=>{

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({"info": "Zahtevani so vsi podatki"});
      }
     var userSega = User.findOne({email : req.body.email}, function(napaka, user){
        if(napaka){
            return res.status(500).json({"info": "Mongo Error!"});
        }
        else if (!user) {
            res.status(404).json({
                "info" : "User with this email already exists!"
            });
        }
        else {
            console.log(user);
            user.nastaviGeslo(req.body.password);
              
            user.save(napaka => {
                if (napaka) {
                  res.status(500).json({
                      "info" : "User save error!"
                  });
                } else {
                  res.status(200).json({"token": user.generirajJwt(user)});
                }
              });

        }
    });
    
}


const loginUser = (req, res) => {
    
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({"info": "Zahtevani so vsi podatki"});
    }
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)) return res.status(400).json({"info": "Email does not conform to standards!"});
    if (!/^[\w@#$%*()!?]{3,20}$/.test(req.body.password)) return res.status(400).json({"info": "Password does not conform to standard!"});
    passport.authenticate('local', (napaka, uporabnik, informacije) => {
      if (napaka)
        return res.status(500).json({"info": "Passport Error!"});
      if (uporabnik) {
          console.log(uporabnik);
        res.status(200).json({"info": uporabnik.generirajJwt(uporabnik)});
      } else {
        res.status(401).json({"info": informacije});
      }
    })(req, res);
};



const register = (req, res) => {
    //ce ze obstaja uporabnik s tem email-om
    var userSega = User.findOne({email : req.body.email}, function(napaka, data){
        if (data) {
            res.status(400).json({"info" : "User with this email already exists!"});
        }
        else {
            const user = new User();
            user.firstname = req.body.firstname;
            if(!/^[a-zA-Z0-9]*$/.test(user.firstname)) return res.status(400).json({"info": "Firstname does not conform to standards!"});
            user.lastname= req.body.lastname;
            if(!/^[a-zA-Z0-9]*$/.test(user.lastname)) return res.status(400).json({"info": "Lastname does not conform to standards!"});
            user.email = req.body.email;
            if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(user.email)) return res.status(400).json({"info": "Email does not conform to standards!"});
            user.nastaviGeslo(req.body.password);
            user.save(napaka => {
                if (napaka) {
                  res.status(500).json({"info": "Could not save user!"});
                } else {
                  res.status(200).json({"info": "Success"});
                }
              });

        }
    });
};

const checkRole = (roles, next) => (req, res) => {
  if(req.user == undefined) console.log("No user");
  console.log("checking role "+req.user.role);
  if(roles.indexOf(req.user.role) < 0) {
    console.log("Unauthorised");
    return res.status(401).json({"info": "Unauthorised!"});
  } else {
    console.log("Authorised");
    return next(req, res);
  }
}

module.exports = {
    register,
    changePassword,
    loginUser,
    checkRole
};