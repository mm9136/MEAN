const request = require('request');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}
/*
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://skupina2-sp-2019-2020.herokuapp.com';
}
*/
var db = function(req, res) {
    const admin = req.session.admin;
    if(req.session.admin == true){
                var data = {
                    "title": 'MESTmovies',
                    "layout" : "layoutAdminLoggedin",
                    "admin":admin,
                    "msg": req.query.msg,
                    "msgDelete":req.query.msgDelete
                };
            }else if(req.session.admin == false){
                var data = {
                    "title": 'MESTmovies',
                    "layout" : "layoutUserLoggedin",
                    "admin":admin,
                    "msg": req.query.msg,
                    "msgDelete":req.query.msgDelete
                };
            }else{
                var data = {
                    "title": 'MESTmovies',
                    "layout" : "layout",
                    "admin":admin,
                    "msg": req.query.msg,
                    "msgDelete":req.query.msgDelete
                };

            }
            
    res.render('db', data);
};

var deleteRequest = (req, res) => {


    const pot = '/api/delete';
    console.log(apiParametri.streznik + pot);
    var parametriZahteve = {
        url: apiParametri.streznik + pot,
        method: 'POST',
        json: {}
    };

    request(parametriZahteve, (napaka, odgovor, vsebina) => {

        if(odgovor.statusCode == 204)
            res.redirect('/db?msgDelete=Successfully deleted data!');
        else
            res.render('error', { title: 'MESTmovies', message: "Error - delete data", error: napaka});
    });

};

var createRequest = function(req, res) {
    const pot = '/api/create';
    var parametriZahteve = {
        url: apiParametri.streznik + pot,
        method: 'POST',
        json: {}
    };

    request(parametriZahteve, (napaka, odgovor, data) => {
        if(odgovor.statusCode == 201)
            res.redirect('/db?msg=Successfully created data!');
        else{
            console.log(data.info);
            res.render('error', { title: 'MESTmovies', message: "Error - create data", error: napaka});
        }
    });

};

module.exports = {
    db,
    deleteRequest,
    createRequest
};