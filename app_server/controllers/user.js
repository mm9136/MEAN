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
var getLogin = (req, res) => {
    var login = {
        title: 'Log in',
        login_active:'active'
    };
    res.render('login.hbs', login);
};

/*GET promena pasvord*/
var getChangePassword = (req, res) => {
        if(req.session.admin == true){
            var data = {
                "layout" : "layoutAdminLoggedin"
            };
            res.redirect("/");
        }else if(req.session.admin == false){
            var data = {
                "layout" : "layoutUserLoggedin",
                "username": req.session.user_name
            };
        }else{
           res.redirect("/");
        }
        res.render("changePassword", data);
 
};

/*GET registracija*/
var getRegister = (req, res) => {
    res.render('register.hbs', {
        title: 'Register'
    });
};


/*GET Forgotten password*/
var getForgotPassword = (req, res) => {
    res.render('forgotPassword.hbs', {
        title: 'Forgotten password',
        msg:'Please check your email for confirmation link.' 
    });
};



var logout = (req, res) => {
    
    req.session.destroy(() => {
        res.redirect('/');
        
    });
    
    
	
};

//validation

// POST REGISTER
var postRegister = (req, res) => {
    const pot = '/api/users/create';
    var newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    };
    var parametriZahteve = {
        url: apiParametri.streznik + pot,
        method: 'POST',
        json: newUser
    };
   
    request(parametriZahteve, (napaka, { statusCode }, data) => {
            if (statusCode === 201) {
               res.render('register.hbs', {
                    title: 'Register', msg:"Registration successfull!"
                });
            }
            else if (statusCode == 401) {
                res.render('register.hbs', {
                    title: 'Register', error_msg: data.message
                });
            }
            else if (statusCode === 400) {
                res.render('error', { title: 'Error page', message: "Error - registration", error: napaka});
            }
        }
    );
    
};

// POST LOG IN
var postLogin = (req, res) => {
    const pot = '/api/users/login';
    const novUser = {
        email: req.body.email,
        password: req.body.password,
    };
    const parametriZahteve = {
        url: apiParametri.streznik + pot,
        method: 'POST',
        json: novUser
    };
   
    request(parametriZahteve, (napaka, { statusCode }, data) => {
            if (statusCode === 200 && data) {
               
                req.session.admin = data.admin;
                req.session.user = data._id;
                req.session.user_name = data.firstname + " " + data.lastname;
               
               if(req.session.admin){
                    res.redirect('/');
               }
                else{
                     res.redirect('/');
                }
            }
            else if (statusCode === 400) {
                res.render('login', {title: 'Login', error_msg: data.message});
            }
        }
    );
    
};

// POST change passwrod
var changePassword = (req, res) => {
    const pot = '/api/users/changePassword/';
    const newUser = {
        password: req.body.newPassword,
        user: req.session.user
    };
    const parametriZahteve = {
        url: apiParametri.streznik + pot,
        method: 'POST',
        json: newUser
    };
    if (!newUser.password) {
        res.redirect('/changePassword?error=true');
    }
    else {
         request(parametriZahteve, (napaka, { statusCode }, data) => {
            if (statusCode === 201) {
                 if(req.session.admin == true){
                    var data = {
                        "title": 'Change Password',
                        "layout" : "layoutAdminLoggedin",
                        "msg":"Password successfully changed!"
                    };
                }else if(req.session.admin == false){
                    var data = {
                        "title": 'Change Password',
                        "layout" : "layoutUserLoggedin",
                        "username": req.session.user_name,
                        "msg":"Password successfully changed!"
                    };
                }
        
               res.render('changePassword', data);
            }
            else if (statusCode == 401) {
                res.render('changePassword.hbs', {
                    title: 'Change Password', error_msg: data.message
                });
            }
            else if (statusCode === 400) {
                res.render('error', { title: 'Error page', message: "Error - change password", error: napaka});
            }
        }
    );
    }
};


/*added all made functions*/
module.exports = {
    //getUsers,
    //getUser,
    changePassword,
    postRegister,
    postLogin,
    getLogin,
    getForgotPassword,
    getRegister,
    getChangePassword,
    logout
};
