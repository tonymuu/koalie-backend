(function() {
  var CollectionDriver, MongoClient, Server, app, bodyParser, collectionDriver, configDB, cookieParser, express, flash, mongoClient, mongoHost, mongoPort, mongoose, morgan, passport, path, session;

  express = require('express');

  mongoose = require('mongoose');

  passport = require('passport');

  flash = require('connect-flash');

  morgan = require('morgan');

  cookieParser = require('cookie-parser');

  session = require('express-session');

  configDB = require('./config/database.js');

  path = require('path');

  bodyParser = require('body-parser');

  MongoClient = require('mongodb').MongoClient;

  Server = require('mongodb').Server;

  CollectionDriver = require('./CollectionDriver.js');

  app = express();

  app.set('port', process.env.PORT || 3000);

  mongoose.connect(configDB.url);

  require('./config/passport')(passport);

  app.use(morgan('dev'));

  app.use(cookieParser());

  app.use(bodyParser());

  app.set('view engine', 'ejs');

  app.use(session({
    secret: 'tonymuisanawesomedeveloperwhowrotethisapp'
  }));

  app.use(passport.initialize());

  app.use(passport.session());

  app.use(flash());

  require('./app/routes.js')(app, passport);

  mongoHost = 'localhost';

  mongoPort = 27017;

  collectionDriver = "";

  mongoClient = new MongoClient(new Server(mongoHost, mongoPort));

  mongoClient.open(function(err, mongoClient) {
    var db;
    if (!mongoClient) {
      console.error("Error! Exiting... No MongoDB found.");
      process.exit(1);
    }
    db = mongoClient.db("MyDatabase");
    return collectionDriver = new CollectionDriver(db);
  });

  app.use(express["static"](path.join(__dirname, 'public')));

  app.listen(3000, function() {
    return console.log('Server listening on port 3000...');
  });

}).call(this);
