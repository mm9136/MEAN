const request = require('request');
const session = require('express-session');
const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}

/*GET prijava*/
var getHistory = (req, res) => {
   if(req.session.admin == false){
     axios.get(apiParametri.streznik + '/api/bills/user/' +req.session.user ).then((info) => {
      
            var data = {
                "title": 'History',
                "bills": info.data.info,
                "layout" : "layoutUserLoggedin",
                "username": req.session.user_name
            };
      
        
        res.render("history", data);
    });
   }else{
            res.redirect("/");
    }
};
module.exports = {
    getHistory
};