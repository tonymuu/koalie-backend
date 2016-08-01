module.exports = (app, passport) ->
  Media = require '../app/models/Media'
  Event = require '../app/models/Event'

  app.get('/', (req, res) ->
    res.render('index.ejs'))

  app.get('/login', (req, res) ->
    res.render('login.ejs', message: req.flash('loginMessage')))

  app.get('/auth/facebook/token', passport.authenticate('facebook-token'), (req,res) ->
    console.log "The token is" + req.param('access_token')
    res.send(200))

  # process the login forms
  # app.post('/login', do all passport stuff here)

  app.get('/signup', (req, res) ->
    res.render('signup.ejs', message: req.flash('signupMessage')))

  # we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req, res) ->
    res.render('profile.ejs', user: req.user)) # getting user from session

  app.get('/logout', (req, res) ->
    req.logout()
    res.redirect('/'))

  # process the signup form
  app.post('/signup', passport.authenticate(
    'local-signup'
    successRedirect: '/profile'
    failureRedirect: '/signup'
    failureFlash: true))

  app.post('/login', passport.authenticate(
    'local-login'
    successRedirect: '/profile'
    failureRedirect: '/login'
    failureFlash: true))

  app.get('/auth/facebook', passport.authenticate(
    'facebook'
    scope: 'email'))

  app.get('/auth/facebook/callback', passport.authenticate(
    'facebook'
    successRedirect: '/profile'
    failureRedirect: '/'))

  app.post('/media', isLoggedIn, (req, res) ->
    newMedia = new Media()
    newMedia.media.user_id = req.user._id
    newMedia.media.stored_path = req.body.stored_path
    newMedia.save ->
      if err? then throw err
      else res.redirect('/profile'))

  app.get('/medias', isLoggedIn, (req, res) ->
    userId = req.user._id
    Media.find( 'media.user_id': userId ).populate('stored_path').exec (err, medias) ->
      if err? then return console.log err
      else
        res.medias = medias
        res.send(200)
        for media in medias
          console.log "the medias are #{media.media.stored_path}")


  app.post('/event', isLoggedIn, (req, res) ->
    newEvent = new Event()
    newEvent.event.name = req.param(''))


  app.get('/events', isLoggedIn, (req, res) -> )


  # app.get('/media')

# route middleware to make sure a user is logged in
isLoggedIn = (req, res, next) ->
  if req.isAuthenticated() then return next()
  res.redirect('/')
