const request = require('request');
const session = require('express-session');
const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}

const getMESTmovies = (req, res)=>{
    axios.get(apiParametri.streznik + '/api/genres').then((info) => {
        if(req.session.admin == true){
            var data = {
                "title": 'MESTmovies',
                "movie_genre": info.data.info,
                "mestmovies_active" : "active",
                "layout" : "layoutAdminLoggedin"
            };
        }else if(req.session.admin == false){
            var data = {
                "title": 'MESTmovies',
                "movie_genre": info.data.info,
                "mestmovies_active" : "active",
                "layout" : "layoutUserLoggedin",
                "username": req.session.user_name
            };
        }else{
            var data = {
                "title": 'MESTmovies',
                "movie_genre": info.data.info,
                "mestmovies_active" : "active",
                "layout" : "layout"
            };

        }
        res.render("MESTmovies", data);
    });
}

const search = (req, res)=>{
    const pot = '/api/search';
    var api_path = pot+"?";
    
    if(typeof req.body.search != "undefined" && req.body.search.trim() != "" && typeof req.body.genre != "undefined" && req.body.genre.trim() != "")
        api_path+="q="+req.body.search.replace(" ", "+")+"&g="+req.body.genre.replace(" ", "+");
    else if(typeof req.body.search != "undefined" && req.body.search.trim() != "") api_path+="q="+req.body.search.replace(" ", "+");
    else if(typeof req.body.genre != "undefined" && req.body.genre.trim() != "") api_path+="g="+req.body.genre.replace(" ", "+");
        
    var parametriZahteve = {
        url: apiParametri.streznik + api_path,
        method: 'GET'
    };
    

    request(parametriZahteve, (napaka, { statusCode }, searchMovies) => {
        var movies = JSON.parse(searchMovies);


        axios.get(apiParametri.streznik + '/api/genres').then((info) => {
            if(req.session.admin == true){
                var data = {
                    "movie_genre": info.data.info,
                    "searchMovies": movies.info,
                    "mestmovies_active" : "active",
                    "layout" : "layoutAdminLoggedin",
                    "msg": statusCode >= 400 ? movies.info:""
                };
            }else if(req.session.admin == false){
                var data = {
                    "movie_genre": info.data.info,
                    "searchMovies": movies.info,
                    "mestmovies_active" : "active",
                    "layout" : "layoutUserLoggedin",
                    "msg": statusCode >= 400 ? movies.info:""
                };
            }else{
                var data = {
                    "movie_genre": info.data.info,
                    "searchMovies": movies.info,
                    "mestmovies_active" : "active",
                    "layout" : "layout",
                    "msg": statusCode >= 400 ? movies.info:""
                };

            }
            res.render("MESTmovies", data);
        });
    });
}


module.exports = {
    getMESTmovies,
    search
};