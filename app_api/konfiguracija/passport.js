const passport = require('passport');
const LokalnaStrategija = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(
  new LokalnaStrategija(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (uporabniskoIme, geslo, pkKoncano) => {
      User.findOne(
        { email: uporabniskoIme },
        (napaka, data) => {
          if (napaka)
            return pkKoncano(napaka);
          if (!data) {
            return pkKoncano(null, false, {
              "info": "Napačno uporabniško ime"
            });
          }
          if (!data.preveriGeslo(geslo)) {
            return pkKoncano(null, false, {
              "info": "Napačno geslo"
            });
          }
          return pkKoncano(null, data);
        }
      );
    }
  )
);
