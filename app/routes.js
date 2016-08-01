(function() {
  var isLoggedIn;

  module.exports = function(app, passport) {
    var Event, Media;
    Media = require('../app/models/Media');
    Event = require('../app/models/Event');
    app.get('/', function(req, res) {
      return res.render('index.ejs');
    });
    app.get('/login', function(req, res) {
      return res.render('login.ejs', {
        message: req.flash('loginMessage')
      });
    });
    app.get('/auth/facebook/token', passport.authenticate('facebook-token'), function(req, res) {
      console.log("The token is" + req.param('access_token'));
      return res.send(200);
    });
    app.get('/signup', function(req, res) {
      return res.render('signup.ejs', {
        message: req.flash('signupMessage')
      });
    });
    app.get('/profile', isLoggedIn, function(req, res) {
      return res.render('profile.ejs', {
        user: req.user
      });
    });
    app.get('/logout', function(req, res) {
      req.logout();
      return res.redirect('/');
    });
    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    }));
    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
    }));
    app.get('/auth/facebook', passport.authenticate('facebook', {
      scope: 'email'
    }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));
    app.post('/media', isLoggedIn, function(req, res) {
      var newMedia;
      newMedia = new Media();
      newMedia.media.user_id = req.user._id;
      newMedia.media.stored_path = req.body.stored_path;
      return newMedia.save(function() {
        if (typeof err !== "undefined" && err !== null) {
          throw err;
        } else {
          return res.redirect('/profile');
        }
      });
    });
    app.get('/medias', isLoggedIn, function(req, res) {
      var userId;
      userId = req.user._id;
      return Media.find({
        'media.user_id': userId
      }).populate('stored_path').exec(function(err, medias) {
        var i, len, media, results;
        if (err != null) {
          return console.log(err);
        } else {
          res.medias = medias;
          res.send(200);
          results = [];
          for (i = 0, len = medias.length; i < len; i++) {
            media = medias[i];
            results.push(console.log("the medias are " + media.media.stored_path));
          }
          return results;
        }
      });
    });
    app.post('/event', isLoggedIn, function(req, res) {
      var newEvent;
      newEvent = new Event();
      return newEvent.event.name = req.param('');
    });
    return app.get('/events', isLoggedIn, function(req, res) {});
  };

  isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/');
  };

}).call(this);
