# load all things
LocalStrategy = require('passport-local').Strategy
User = require '../app/models/user'

module.exports = (passport) ->
  # passport session setup, for persistent login sessions
  passport.serializeUser (user, done) ->
    done(null, user.id)

  passport.deserializeUser (id, done) ->
    User.findById(id, (err, user) ->
      done(err, user))

  passport.use('local-signup', new LocalStrategy(
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true # allows passing back the entire request object to callback
    (req, email, password, done) ->
      # async: User.findOne won't fire unless data is sent back
      process.nextTick ->
        # find a user whose email is the same as the forms email
        User.findOne({ 'local.email': email }, (err, user) ->
          if err? then done(err)
          if user? then done(null, false, req.flash('signupMessage', 'The email has already been taken!'))
          else
            newUser = User()
            newUser.local.email = email
            newUser.local.password = newUser.generateHash(password)
            newUser.save (err) ->
              if err? then throw err
              done(null, newUser))
  ))
