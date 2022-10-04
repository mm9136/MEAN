var mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


/**
 * @swagger
 * components:
 *  schemas:
 *    UserLogin:
 *      type: object
 *      description: Podatki uporabnika za prijavo
 *      properties:
 *        email:
 *          type: string
 *          description: email
 *          example: tt2834@student.uni-lj.si
 *          pattern: '/^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/'
 *        password:
 *          type: string
 *          format: password
 *          example: test
 *          minLength: 3
 *          maxLength: 20
 *      required:
 *        - email
 *        - password
 *    UserRegister:
 *      type: object
 *      description: Podatki uporabnika za registracijo
 *      properties:
 *        firstname:
 *          type: string
 *          description: ime
 *          writeOnly: true
 *          example: Mila
 *        lastname:
 *          type: string
 *          description: priimek
 *          writeOnly: true
 *          example: Marinkovic
 *        email:
 *          type: string
 *          description: email
 *          example: tt2834@student.uni-lj.si
 *          pattern: '/^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/'
 *        password:
 *          type: string
 *          format: password
 *          example: test
 *          minLength: 3
 *          maxLength: 20
 *        role:
 *          type: string
 *          enum:
 *            - user
 *            - admin
 *          example: user
 *          default: user
 *      required:
 *        - firstname
 *        - lastname
 *        - email
 *        - password
 *    AvtentikacijaResponse:
 *      type: object
 *      description: Rezultat uspešne avtentikacije uporabnika
 *      properties:
 *        token:
 *          type: string
 *          description: JWT token
 *          example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZhMjBlZDlhZGM0MzIyNmY0NjhkZjMiLCJlbGVrdHJvbnNraU5hc2xvdiI6ImRlamFuQGxhdmJpYy5uZXQiLCJpbWUiOiJEZWphbiBMYXZiacSNIiwiZGF0dW1Qb3Rla2EiOjE1Nzc5NTU2NjMsImlhdCI6MTU3NzM1MDg2M30.PgSpqjK8qD2dHUsXKwmqzhcBOJXUUwtIOHP3Xt6tbBA
 *      required:
 *        - token
 *    Error:
 *      type: object
 *      description: Podrobnosti napake
 *      required:
 *        - sporočilo
 *      properties:
 *        sporočilo:
 *          type: string
 *      example:
 *        sporočilo: Parametri so obvezni.
 *    User:
 *      description: ''
 *      type: object
 *      properties:
 *        role:
 *          type: string
 *          minLength: 1
 *          example: admin
 *        bills:
 *          type: array
 *          items:
 *            required: []
 *            properties: {}
 *        _id:
 *          type: string
 *          minLength: 1
 *          example: 5fe645d9a70c0d3fd86e3685
 *        firstname:
 *          type: string
 *          minLength: 1
 *          example: Miha
 *        lastname:
 *          type: string
 *          minLength: 1
 *          example: Novak
 *        email:
 *          type: string
 *          minLength: 1
 *          example: miha@novak.com
 *        salt:
 *          type: string
 *          minLength: 1
 *          example: 6333513d7b95834fb2b0a1de18a9abd7
 *        password:
 *          type: string
 *          minLength: 1
 *          example: cae64e23dc828b367276db406b9eedf182f85631fedda22c22a90902c463611f17fcdfebe4b9a5163176aaa794aae561ac42da969d4439e75f101396885992b0
 *        __v:
 *          type: number
 *      required:
 *        - role
 *        - bills
 *        - _id
 *        - firstname
 *        - lastname
 *        - email
 *        - salt
 *        - password
 *        - __v
 *      x-tags:
 *        - Users
 */
const usersShema = new mongoose.Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  salt: {type: String, required: true},
  //admin: Boolean,
  role: {type: String, default: "user", enum: ["user", "admin"]},
  bills: [{type: mongoose.Schema.Types.ObjectId, ref: "Bill"}]
});
//register
usersShema.methods.nastaviGeslo = function(geslo) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto
    .pbkdf2Sync(geslo, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};
//login
usersShema.methods.preveriGeslo = function(geslo) {
  let password = crypto
    .pbkdf2Sync(geslo, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.password == password;
};

usersShema.methods.generirajJwt = (user) => {
  const datumPoteka = new Date();
  datumPoteka.setDate(datumPoteka.getDate() + 7);
  return jwt.sign({
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role:user.role,
    exp: parseInt(datumPoteka.getTime() / 1000, 10)
  }, process.env.JWT_GESLO);
};
mongoose.model('User', usersShema, 'Users');