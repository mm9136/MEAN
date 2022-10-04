const request = require('request');
const session = require('express-session');
const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}

/*GET genre*/
var getGenre = (req, res) => {
    axios.get(apiParametri.streznik + '/api/genres').then((info) => {
        if(req.session.admin == true){
            var data = {
                "title": 'Genres',
                "movie_genre": info.data.info,
                "genre_active" : "active",
                "layout" : "layoutAdminLoggedin"
            };
        }else if(req.session.admin == false){
            var data = {
                "title": 'Genres',
                "movie_genre": info.data.info,
                "genre_active" : "active",
                "layout" : "layoutUserLoggedin",
                "username": req.session.user_name
            };
        }else{
            var data = {
                "title": 'Genres',
                "movie_genre": info.data.info,
                "genre_active" : "active",
                "layout" : "layout"
            };

        }
        res.render("genre", data);
    });
};


module.exports = {
    getGenre
};