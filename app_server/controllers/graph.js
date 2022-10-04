const request = require('request');
const session = require('express-session');
const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}

/*GET graph*/
var getGraph = (req, res) => {
        if(req.session.admin == true){
            var data = {
                "title": 'Graph',
                "layout" : "layoutAdminLoggedin"
            };
        }else{
            res.redirect("/");

        }
        res.render("graph", data);
   
};


module.exports = {
    getGraph
};