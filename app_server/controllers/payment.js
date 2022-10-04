const request = require('request');
var apiParametri = {
    streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://sp-mestmovies.herokuapp.com';
}
/*GET placilo*/
var getPayment= (req, res) => {
    res.render('payment.hbs', {
        title: 'Payment Details',
        user: req.session.user
    });
    if(!req.session.user || req.session.admin){
         res.redirect("/");
    }
};


/*GET uspesna transakcija*/
var getSuccessfulTransaction = (req, res) => {
    if(req.session.admin == true){
                var data = {
                    "title" : 'Successful Transaction',
                    "layout" : "layoutAdminLoggedin",
                    "admin":req.session.admin,
                    "order_id": req.query.id
                };
            }else if(req.session.admin == false){
                var data = {
                    "title" : 'Successful Transaction',
                    "layout" : "layoutUserLoggedin",
                    "admin":req.session.admin,
                    "username": req.session.user_name,
                    "order_id": req.query.id
                };
            }else{
                var data = {
                    "title" : 'Successful Transaction',
                    "layout" : "layout",
                    "admin":req.session.admin,
                    "order_id": req.query.id
                };
            }
    if(!req.session.user || req.session.admin){
         res.redirect("/");
    }         
    res.render('successfulTransaction.hbs', data);
};


/*GET neuspesna transakcija*/
var getUnsuccessfulTransaction = (req, res) => {
    if(!req.session.user || req.session.admin){
         res.redirect("/");
    }
    res.render('unsuccessfulTransaction.hbs', {
        title: 'Unsuccessful Transaction',
    });
};

// placilo layout
var bill = (req, res) => {
   
    res.render('bill.hbs', {
        title: 'Bill'
    });
};

module.exports = {
    getPayment,
    getSuccessfulTransaction,
    getUnsuccessfulTransaction,
    bill
};




