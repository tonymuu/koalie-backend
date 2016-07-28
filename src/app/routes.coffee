module.exports = (app, passport) ->
  app.get('/', (req, res) ->
    res.render('index.ejs'))

  app.get('/login', (req, res) ->
    res.render('login.ejs',
      message: req.flash('loginMessage')))

  # process the login forms
  # app.post('/login', do all passport stuff here)

  app.get('/signup', (req, res) ->
    res.render('signup.ejs',
      message: req.flash('signupMessage')))

  # process the signup form
  # app.post('/signup', do all our passport stuff here);

  # we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req, res) ->
    res.render('profile.ejs',
      user: req.user)) # getting user from session

  app.get('/logout', (req, res) ->
    req.logout()
    res.redirect('/'))

  # process the signup form
  app.post('/signup', passport.authenticate('local-signup',
    successRedirect: '/profile'
    failureRedirect: '/signup'
    failureFlash: true))

  app.post('/login', passport.authenticate('local-login',
    successRedirect: '/profile'
    failureRedirect: '/login'
    failureFlash: true))

  app.get('/auth/facebook', passport.authenticate('facebook',
    scope: 'email'))

  app.get('/auth/facebook/callback', passport.authenticate('facebook',
    successRedirect: '/profile'
    failureRedirect: '/'))

# route middleware to make sure a user is logged in
isLoggedIn = (req, res, next) ->
  if req.isAuthenticated() then return next()
  res.redirect('/')


  # app.get('/:collection', (req, res) ->
  #   params = req.params
  #   collectionDriver.findAll(req.params.collection, (error, objs) ->
  #     if error then res.status(400).send(error)
  #     else res.status(200).send(objs)))
  #
  # app.get('/:collection/:entity', (req, res) ->
  #   params = req.params
  #   collection = params.collection
  #   entity = params.entity
  #   if entity
  #     collectionDriver.get(collection, entity, (error, objs) ->
  #       if error then res.status(400).send(error)
  #       else res.status(200).send(objs))
  #   else res.status(400).send {error: 'bad url', url: req.url})
  #
  # app.post('/:collection', (req, res) ->
  #   object = req.body
  #   collection = req.params.collection
  #   collectionDriver.save(collection, object, (error, docs) ->
  #     if error then res.status(400).send(error)
  #     else res.status(201).send(docs)))
  #
  # app.put('/:collection/:entity', (req, res) ->
  #   params = req.params
  #   entity = params.entity
  #   collection = params.collection
  #   if eneity? then collectionDriver.update(
  #     collection,
  #     req.body,
  #     entity,
  #     (error, objs) ->
  #       if error? then res.status(400).send error
  #       else res.status(200).send objs)
  #   else
  #     error = { "message": "Cannot PUT a whole collection" }
  #     res.status(400).send error)
  #
  # app.delete('/:collection/:entity', (req, res) ->
  #   params = req.params
  #   collection = params.collection
  #   entity = params.entity
  #   if entity? then collectionDriver.delete(collection, entity, (error, objs) ->
  #     if error? then res.status(400).send error
  #     else res.sendStatus 200)
  #   else
  #     error = { "message": "Cannot Delete a whole collection!" }
  #     res.status(400).send error)
