const axios = require('axios');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}

const getManageDVDs = (req, res)=>{
    getSite(req, res);
}

const modifyManageDVDs = (req, res)=>{
    var method = req.body.method;
    if(method == "DELETE") remove(req, res);
    else if(method == "PUT") update(req, res);
    else if(method == "POST" ) add(req, res);
    else getSite(req, res, undefined, "HOW!")
}

function add(req, res) {
    var outdata = {
        "name": req.body.name,
        "price": req.body.price,
        "quantity": req.body.quantity,
        "description": req.body.description,
    };
    if(typeof req.body.movies == "string" && req.body.movies.trim() != "") outdata.movies = [req.body.movies];
    else if(typeof req.body.movies != "undefined") outdata.movies = req.body.movies;
    //console.log("server outdata "+JSON.stringify(outdata));
    if(typeof outdata.name == "undefined" || outdata.name.trim() == "" || typeof outdata.price == "undefined" || outdata.price.trim() == "" ||
        typeof outdata.quantity == "undefined" || outdata.quantity.trim() == "" || typeof outdata.movies == "undefined" || outdata.movies.length == 0) {
            getSite(req, res, undefined, "Please input valid data for all fields and add at least one movie.");
    } else {
        axios.post(apiParametri.streznik + '/api/DVDs', outdata).then((data)=>{
            getSite(req, res, "Successfully added DVD.");
        }).catch((err)=>{
            if(err) {
                console.log(err);
                var data = {
                    "genre": [],
                    "dvd": [],
                    "error_msg": err.response.data,
                    "movies_active" : "active",
                    "layout" : "layoutAdminLoggedin",
                    "admin": req.session.admin,
                    "title": "manageDVDs"
                };
                res.render("manageDVDs", data);
            }
        });
    }
}

function update(req, res) {
    var outdata = {
        "name": req.body.name,
        "price": req.body.price,
        "quantity": req.body.quantity,
        "description": req.body.description,
    };
    if(typeof req.body.movies == "string" && req.body.movies.trim() != "") outdata.movies = [req.body.movies];
    else if(typeof req.body.movies != "undefined") outdata.movies = req.body.movies;
    //console.log("server outdata "+JSON.stringify(outdata));
    if(typeof outdata.name == "undefined" || outdata.name.trim() == "" || typeof outdata.price == "undefined" || outdata.price.trim() == "" ||
        typeof outdata.quantity == "undefined" || outdata.quantity.trim() == "" || typeof outdata.movies == "undefined" || outdata.movies.length == 0) {
            getSite(req, res, undefined, "Please input valid data for all fields and add at least one movie.");
    } else {
        axios.put(apiParametri.streznik + '/api/DVDs/id/' + req.body.dvd, outdata).then((data)=>{
            getSite(req, res, "Successfully modified DVD.");
        }).catch((err)=>{
            if(err) {
                console.log(err);
                var data = {
                    "genre": [],
                    "dvd": [],
                    "error_msg": err.response.data,
                    "movies_active" : "active",
                    "layout" : "layoutAdminLoggedin",
                    "admin": req.session.admin,
                    "title": "manageDVDs"
                };
                res.render("manageDVDs", data);
            }
        });
    }
}

function remove(req, res) {
    axios.delete(apiParametri.streznik + '/api/DVDs/id/' + req.body.dvd).then((data)=>{
        getSite(req, res, "Successfully removed DVD.");
    }).catch((err)=>{
        console.log(err.status);
        if(err) {
            var data = {
                "genre": [],
                "dvd": [],
                "error_msg": err.response.data,
                "movies_active" : "active",
                "layout" : "layoutAdminLoggedin",
                "admin": req.session.admin,
                "title": "manageDVDs"
            };
            res.render("manageDVDs", data);
        }
    });
}

function getSite(req, res, succ_message=undefined, warn_message=undefined) {
    axios.get(apiParametri.streznik + '/api/genres').then((info) => {
        axios.get(apiParametri.streznik + '/api/DVDs').then((dvd) => {
            var data = {
                "genre": info.data.info,
                "dvd": dvd.data.info,
                "success_msg": succ_message,
                "warning_msg": warn_message,
                "movies_active" : "active",
                "layout" : "layoutAdminLoggedin",
                "admin": req.session.admin,
                "title": "manageDVDs"
            };
            if(!req.session.admin){
                res.redirect("/");
            }
            res.render("manageDVDs", data);
        }).catch((err)=>{
            if(err) {
                var data = {
                    "genre": info.data.info,
                    "dvd": [],
                    "error_msg": err.response.data,
                    "movies_active" : "active",
                    "layout" : "layoutAdminLoggedin",
                    "admin": req.session.admin,
                    "title": "manageDVDs"
                };
                res.render("manageDVDs", data);
            }
        });
    }).catch((err)=>{
        if(err) {
            var data = {
                "genre": [],
                "dvd": [],
                "error_msg": err.response.data,
                "movies_active" : "active",
                "layout" : "layoutAdminLoggedin",
                "admin": req.session.admin,
                "title": "manageDVDs"
            };
            res.render("manageDVDs", data);
        }
    });
}

module.exports = {
    getManageDVDs,
    modifyManageDVDs
};