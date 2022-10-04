const request = require('request');
const session = require('express-session');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}

/*GET getShopingCart*/
var getShopingCart = (req, res) => {
    const admin = req.session.admin;
    if(req.session.admin == false){
        var data = {
            "title": 'Cart',
            "movies_active" : "active",
            "layout" : "layoutUserLoggedin",
            "username": req.session.user_name,
            "admin":admin
        };
    }
    if(!req.session.user || req.session.admin){
        res.redirect("/");
    }

    res.render('shopingCart.hbs', data);
};
module.exports = {
    getShopingCart
};