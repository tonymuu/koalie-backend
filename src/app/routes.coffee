Media = require '../app/models/Media'
Event = require '../app/models/Event'
User = require '../app/models/User'

module.exports = (app, passport) ->

  app.get('/', (req, res) ->
    res.render('index.ejs'))

  app.get('/login', (req, res) ->
    res.render('login.ejs', message: req.flash('loginMessage')))

  app.get('/auth/facebook/token', passport.authenticate('facebook-token'), (req,res) ->
    console.log "Sucess got the token"
    return res.send(200))

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
    newMedia.user_id = req.user._id
    newMedia.stored_path = req.body.stored_path
    newMedia.save (err, media) ->
      if err? then throw err
      else res.redirect('/profile'))

  app.get('/medias', isLoggedIn, (req, res) ->
    userId = req.user._id
    Media.find( 'user_id': userId ).populate('stored_path').exec (err, medias) ->
      if err? then return console.log err
      else
        res.medias = medias
        res.send(200)
        for media in medias
          console.log "the medias are #{media.stored_path}")


  app.post('/create_event', isLoggedIn, (req, res) ->
    newEvent = new Event()
    if err? then return console.log err
    console.log req.user._id
    newEvent.admin = req.user._id
    newEvent.name = req.body.eventName
    newEvent.size = req.body.eventSize
    # newEvent.event.date_start = req.body.startDate
    # newEvent.event.date_end = req.body.endDate
    newEvent.save (err, event) ->
      if err? then return console.log err
      else
        console.log "success saved"
        addUserToEvent(req.user._id, event._id)
        addEventToUser(req.user._id, event._id)
        return res.send(200))

  app.get('/search_events', isLoggedIn, (req, res) ->
    eventName = req.query.eventName
    console.log req
    Event.find('name': eventName).populate('admin').exec (err, events) ->
      if err? then return console.log err
      console.log events
      return res.send(events))

  app.post('/join_event', isLoggedIn, (req, res) ->
    eventId = req.body.eventId
    addUserToEvent(req.user._id, eventId)
    addEventToUser(req.user._id, eventId)
    res.send(200))

  app.post('/exit_event', isLoggedIn, (req, res) ->
    eventId = req.body.eventId
    removeUserFromEvent(req.user._id, eventId)
    )


  app.get('/joined_events', isLoggedIn, (req, res) ->
    userId = req.user._id
    User.findById(userId).populate('facebook.events').exec (err, user) ->
      if err? then return console.log err
      # result = [user.facebook]
      # for id in user.facebook.event_ids
      #   Event.findOne( '_id': id).populate('').exec (err, event) ->
      #     result.push(event)
      # res.data.events = events
      # console.log user.facebook
      console.log user.facebook.events
      # event_ids = user.facebook.events
      # for event_id in event_ids
      #   Event.findById(event_id).populate('member_ids').exec (err, event) ->
      #     console.log event.member_ids
      res.send(user.facebook))

# route middleware to make sure a user is logged in
isLoggedIn = (req, res, next) ->
  if req.isAuthenticated() then return next()
  else res.redirect('/')

addUserToEvent = (userId, eventId) ->
  condition = '_id': eventId
  query = $push: "member_ids": userId
  Event.update(condition, query, (err, numAffected) ->
    if err? then console.log err
    console.log "added user to event, #{numAffected} rows affected")
  # Event.findById(eventId).exec (err, event) ->
  #   if err? then return console.log err
  #   if event.member_ids? then event.member_ids.push(userId)
  #   else
  #     members = [userId]
  #     event.member_ids = members
  #   event.save (err, event) ->
  #     if err? then return console.log err
  #     console.log "added event to user"

addEventToUser = (userId, eventId) ->
  condition = '_id': userId
  query = $push: "facebook.events": eventId
  User.update(condition, query, (err, numAffected) ->
    if err? then console.log err
    console.log "added event to user, #{numAffected} rows affected")
  # User.findById(userId).exec (err, user) ->
  #   if err? then return console.log err
  #   if user.facebook.events? then user.facebook.events.push(eventId)
  #   else
  #     events = [eventId]
  #     user.facebook.events = events
  #   user.save (err, event) ->
  #     if err? then return console.log err
  #     console.log "added user to event"

removeUserFromEvent = (userId, eventId) ->
  Event.findOneAndUpdate('_id': eventId, $pullAll: "member_ids": userId, (err, numAffected) ->
    if err? then console.log err
    console.log numAffected)
