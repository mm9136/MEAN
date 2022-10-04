const request = require('request');
const session = require('express-session');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}
const axios = require('axios');

/*GET movie*/
var getMovie = (req, res) => {
    //req.session.admin = true;
    const admin = req.session.admin;
    axios.get(apiParametri.streznik + '/api/genres').then((info) => {
        axios.get(apiParametri.streznik + '/api/movies').then((movies) => {
            if(req.session.admin == true){
                var data = {
                    "title": 'Movies',
                    "movie_genre": info.data.info,
                    "movies": movies.data.info,
                    "movies_active" : "active",
                    "layout" : "layoutAdminLoggedin",
                    "admin":admin
                };
            }else if(req.session.admin == false){
                var data = {
                    "title": 'Movies',
                    "movie_genre": info.data.info,
                    "movies": movies.data.info,
                    "movies_active" : "active",
                    "layout" : "layoutUserLoggedin",
                    "username": req.session.user_name,
                    "admin":admin
                };
            }else{
                var data = {
                    "title": 'Movies',
                    "movie_genre": info.data.info,
                    "movies": movies.data.info,
                    "movies_active" : "active",
                    "layout" : "layout",
                    "admin":admin
                };

            }

            res.render("movies.hbs", data);
        });
    });

};

var saveMovie = (req, res) => {
    const pot = '/api/movies';
    var movie= {
        imdb: req.body.imdb,
        title: req.body.title,
        year: req.body.year,
        genre: req.body.genre,
        description: req.body.description
    }

    var parametriZahteve = {
        url: apiParametri.streznik + pot,
        method: 'POST',
        json: movie
    };

    request(parametriZahteve, (napaka, { statusCode }, data) => {
        const admin = req.session.admin;
        axios.get(apiParametri.streznik + '/api/genres').then((info) => {
            axios.get(apiParametri.streznik + '/api/movies').then((movies) => {
                if(req.session.admin == true){
                    var data = {
                        "movie_genre": info.data.info,
                        "movies": movies.data.info,
                        "movies_active" : "active",
                        "layout" : "layoutAdminLoggedin",
                        "error_msg":statusCode!=201? "Save movie-unsuccessfull": "",
                        "msg":statusCode=200? "Save movie-successfully done": "",
                        "admin":admin
                    };
                }else if(req.session.admin == false){
                    var data = {
                        "movie_genre": info.data.info,
                        "movies": movies.data.info,
                        "movies_active" : "active",
                        "layout" : "layoutUserLoggedin",
                        "error_msg":statusCode!=201? "Save movie-unsuccessfull": "",
                        "msg":statusCode=200? "Save movie-successfully done": "",
                        "admin":admin
                    };
                }else{
                    var data = {
                        "movie_genre": info.data.info,
                        "movies": movies.data.info,
                        "movies_active" : "active",
                        "layout" : "layout",
                        "error_msg":statusCode!=201? "Save movie-unsuccessfull": "",
                        "msg":statusCode=200? "Save movie-successfully done": "",
                        "admin":admin
                    };

                }

                res.render("movies.hbs", data);
            });
        });

    });


}

function remove(req, res) {
    console.log(req.body.movie_id);
    axios.delete(apiParametri.streznik + '/api/movies/id/' + req.body.movie_id).then((data)=>{
        console.log(data.info);
         const admin = req.session.admin;
    axios.get(apiParametri.streznik + '/api/genres').then((info) => {
        axios.get(apiParametri.streznik + '/api/movies').then((movies) => {
            if(req.session.admin == true){
                var data = {
                    "movie_genre": info.data.info,
                    "movies": movies.data.info,
                    "movies_active" : "active",
                    "layout" : "layoutAdminLoggedin",
                    "admin":admin
                };
            }else if(req.session.admin == false){
                var data = {
                    "movie_genre": info.data.info,
                    "movies": movies.data.info,
                    "movies_active" : "active",
                    "layout" : "layoutUserLoggedin",
                    "admin":admin
                };
            }else{
                var data = {
                    "movie_genre": info.data.info,
                    "movies": movies.data.info,
                    "movies_active" : "active",
                    "layout" : "layout",
                    "admin":admin
                };

            }
        });
    });

    }).catch((err)=>{
        console.log(err.status);
        if(err) {
            var data = {
                "genre": [],
                "dvd": [],
                "error_msg": err.response.data
            };
            res.render("mo", data);
        }
    });
}


module.exports = {
    getMovie,
    saveMovie, 
    remove
};