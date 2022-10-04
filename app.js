var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const cors = require('cors');

var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "MESTmovies",
      version: "1.0.0",
      description: "MESTmovies REST API"
    },
    license: {
      name: "GNU LGPLv3",
      url: "https://choosealicense.com/licenses/lgpl-3.0"
    },
    contact: {
      name: "Mila,Tamara,Elena,Sebastjan",
      url: "https://www.tt.net",
      email: "tt2834@student.uni-lj.si"
    },
    servers: [
      { url: "http://localhost:3000/api" },
      { url: "https://sp-mestmovies.herokuapp.com/api" }
    ]
  },
  apis: [
    "./app_api/models/bill.js",
    "./app_api/models/db.js",
    "./app_api/models/dvd.js",
    "./app_api/models/movie.js",
    "./app_api/models/genre.js",
    "./app_api/models/users.js", 
    "./app_api/routes/index.js"
  ]
};
const swaggerDocument = swaggerJsdoc(swaggerOptions);

require("./app_api/models/db");
require('dotenv').config();

//var indexRouter = require('./app_server/routes/index');
var indexApi = require('./app_api/routes/index');

var app = express();
var passport = require('passport');
require('./app_api/konfiguracija/passport');
app.use(passport.initialize());
// Preusmeritev na HTTPS na Heroku
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next();
  });
}
// view engine setup
/* app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

require('./app_server/views/helpers/hbsh.js'); */

app.use(session({ resave: true , secret: '123456' , saveUninitialized: true, cookie: {secure: true, sameSite: "strict"}}));
// Odprava varnostnih pomanjkljivosti
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader("Content-Security-Policy", "\
    default-src 'self'; \
    script-src 'self' https://www.gstatic.com; \
    style-src 'self' 'unsafe-inline' https://www.gstatic.com; \
    img-src 'self' data: 'unsafe-eval'; \
    connect-src 'self' https://sp-mestmovies.herokuapp.com https://www.omdbapi.com https://www.gstatic.com; \
    frame-ancestors 'self'; \
    form-action 'self'\
  ");

  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));
const corsOptions = {origin: [/localhost/, /^https\:\/\/sp-mestmovies\.herokuapp\.com.*/]};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//app.use('/', indexRouter);
app.use('/robots.txt', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'robots.txt'));
});
app.use('/api', indexApi);
app.get(/(\/movies)|(\/genres)|(\/managedvds)|(\/login)|(\/register)|(\/changePassword)|(\/dvds)|(\/graph)|(\/shoppingcart)|(\/payment)|(\/history)|(\/db)/, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});


indexApi.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
indexApi.get("/swagger.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// Obvladovanje napak zaradi avtentikacije
app.use((err, req, res, next) => {
  
  if (err.name == "UnauthorizedError") {
    res.status(401).json({"info": err.name + ": " + err.message});
  }
});

app.locals.cart = {};
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
