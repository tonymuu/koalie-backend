(function() {
  var Event, Media, User, addEventToUser, addUserToEvent, isLoggedIn, removeUserFromEvent;

  Media = require('../app/models/Media');

  Event = require('../app/models/Event');

  User = require('../app/models/User');

  module.exports = function(app, passport) {
    app.get('/', function(req, res) {
      return res.render('index.ejs');
    });
    app.get('/login', function(req, res) {
      return res.render('login.ejs', {
        message: req.flash('loginMessage')
      });
    });
    app.get('/auth/facebook/token', passport.authenticate('facebook-token'), function(req, res) {
      console.log("Sucess got the token");
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
      newMedia.user_id = req.user._id;
      newMedia.stored_path = req.body.stored_path;
      return newMedia.save(function(err, media) {
        if (err != null) {
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
        'user_id': userId
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
            results.push(console.log("the medias are " + media.stored_path));
          }
          return results;
        }
      });
    });
    app.post('/create_event', isLoggedIn, function(req, res) {
      var newEvent;
      newEvent = new Event();
      if (typeof err !== "undefined" && err !== null) {
        return console.log(err);
      }
      console.log(req.user._id);
      newEvent.admin = req.user._id;
      newEvent.name = req.body.eventName;
      newEvent.size = req.body.eventSize;
      return newEvent.save(function(err, event) {
        if (err != null) {
          return console.log(err);
        } else {
          console.log("success saved");
          addUserToEvent(req.user._id, event._id);
          addEventToUser(req.user._id, event._id);
          return res.send(200);
        }
      });
    });
    app.get('/search_events', isLoggedIn, function(req, res) {
      var eventName;
      eventName = req.query.eventName;
      console.log(req);
      return Event.find({
        'name': eventName
      }).populate('admin').exec(function(err, events) {
        if (err != null) {
          return console.log(err);
        }
        console.log(events);
        return res.send(events);
      });
    });
    app.post('/join_event', isLoggedIn, function(req, res) {
      var eventId;
      eventId = req.body.eventId;
      addUserToEvent(req.user._id, eventId);
      addEventToUser(req.user._id, eventId);
      return res.send(200);
    });
    app.post('/exit_event', isLoggedIn, function(req, res) {
      var eventId;
      eventId = req.body.eventId;
      return removeUserFromEvent(req.user._id, eventId);
    });
    return app.get('/joined_events', isLoggedIn, function(req, res) {
      var userId;
      userId = req.user._id;
      return User.findById(userId).populate('facebook.events').exec(function(err, user) {
        if (err != null) {
          return console.log(err);
        }
        console.log(user.facebook.events);
        return res.send(user.facebook);
      });
    });
  };

  isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/');
    }
  };

  addUserToEvent = function(userId, eventId) {
    var condition, query;
    condition = {
      '_id': eventId
    };
    query = {
      $push: {
        "member_ids": userId
      }
    };
    return Event.update(condition, query, function(err, numAffected) {
      if (err != null) {
        console.log(err);
      }
      return console.log("added user to event, " + numAffected + " rows affected");
    });
  };

  addEventToUser = function(userId, eventId) {
    var condition, query;
    condition = {
      '_id': userId
    };
    query = {
      $push: {
        "facebook.events": eventId
      }
    };
    return User.update(condition, query, function(err, numAffected) {
      if (err != null) {
        console.log(err);
      }
      return console.log("added event to user, " + numAffected + " rows affected");
    });
  };

  removeUserFromEvent = function(userId, eventId) {
    return Event.findOneAndUpdate({
      '_id': eventId,
      $pullAll: {
        "member_ids": userId
      }
    }, function(err, numAffected) {
      if (err != null) {
        console.log(err);
      }
      return console.log(numAffected);
    });
  };

}).call(this);
