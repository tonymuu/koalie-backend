(function() {
  module.exports = function(app, passport) {
    var isLoggedIn;
    isLoggedIn = function(req, res, next) {
      if (req.isAuthenticated()) {
        next();
      }
      return res.redirect('/');
    };
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
      return res.render('profiles.ejs', {
        user: req.user
      });
    });
    app.get('/logout', function(req, res) {
      req.logout();
      return res.redirect('/');
    });
    return app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
    }));
  };

}).call(this);
