(function() {
  var LocalStrategy, User;

  LocalStrategy = require('passport-local').Strategy;

  User = require('../app/models/user');

  module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
      return done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
      return User.findById(id, function(err, user) {
        return done(err, user);
      });
    });
    return passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, function(req, email, password, done) {
      return process.nextTick(function() {
        return User.findOne({
          'local.email': email
        }, function(err, user) {
          var newUser;
          if (err != null) {
            done(err);
          }
          if (user != null) {
            return done(null, false, req.flash('signupMessage', 'The email has already been taken!'));
          } else {
            newUser = User();
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            return newUser.save(function(err) {
              if (err != null) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    }));
  };

}).call(this);
