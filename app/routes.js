(function() {
  var isLoggedIn;

  module.exports = function(app, passport) {
    app.get('/', function(req, res) {
      return res.render('index.ejs');
    });
    app.get('/login', function(req, res) {
      return res.render('login.ejs', {
        message: req.flash('loginMessage')
      });
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
    return app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));
  };

  isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/');
  };

}).call(this);
