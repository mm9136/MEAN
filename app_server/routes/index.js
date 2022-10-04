var express = require('express');
var router = express.Router();
const ctrlMEST = require("../controllers/MESTmovies");
const ctrlManDVDs = require("../controllers/manageDVDs");
var ctrlUser = require('../controllers/user');
var ctrlPayment= require('../controllers/payment');
var ctrlMovies= require('../controllers/movies');
var ctrlGenre= require('../controllers/genre');
var ctrlDvds= require('../controllers/dvd');
var ctrlShoppingCart= require('../controllers/shopingCart');
var ctrlHistory= require('../controllers/history');
var crtlDb=require('../controllers/db');
var crtlGraph=require('../controllers/graph');

router.get('/db', crtlDb.db);
router.post('/db/delete', crtlDb.deleteRequest);
router.post('/db/create', crtlDb.createRequest);
// content
router.get('/', ctrlMEST.getMESTmovies);
router.post('/search', ctrlMEST.search);

/*GET, POST login*/
router.get('/login', ctrlUser.getLogin);
router.post('/login', ctrlUser.postLogin);
/*GET prijava*/
router.get('/changePassword', ctrlUser.getChangePassword);
router.post('/changePassword', ctrlUser.changePassword);
/* GET, POST registracija*/
router.get('/register', ctrlUser.getRegister);
router.post('/register', ctrlUser.postRegister);

/*GET prijava*/
router.get('/forgotPassword', ctrlUser.getForgotPassword);

router.get('/logout', ctrlUser.logout);
/*GET movies*/
router.get('/movies', ctrlMovies.getMovie);
/*POST movies*/
router.post('/movies', ctrlMovies.saveMovie);
router.post('/movies/delete', ctrlMovies.remove);
/*GET genre*/
router.get('/genre',ctrlGenre.getGenre);
/*GET dvd*/
router.get('/DVD', ctrlDvds.getDVD);
/*GET payment*/
router.get('/payment', ctrlPayment.getPayment);
/*GET successfulTransaction*/
router.get('/successfulTransaction', ctrlPayment.getSuccessfulTransaction);
/*GET unsuccessfulTransaction*/
router.get('/unsuccessfulTransaction', ctrlPayment.getUnsuccessfulTransaction);
//new layout bill
router.get('/ctrlPayment', ctrlPayment.bill);
// shopping process
router.get('/shopingCart', ctrlShoppingCart.getShopingCart);
//get history
router.get('/history',ctrlHistory.getHistory);
/*GET manageDVDs*/
router.get('/manageDVDs', ctrlManDVDs.getManageDVDs);
router.post('/manageDVDs', ctrlManDVDs.modifyManageDVDs);



router.get('/graph', crtlGraph.getGraph);


module.exports = router;
