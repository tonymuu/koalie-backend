(function() {
  var CollectionDriver, MongoClient, Server, app, bodyParser, collectionDriver, express, mongoClient, mongoHost, mongoPort, path;

  express = require('express');

  path = require('path');

  bodyParser = require('body-parser');

  MongoClient = require('mongodb').MongoClient;

  Server = require('mongodb').Server;

  CollectionDriver = require('./CollectionDriver.js');

  app = express();

  app.set('port', process.env.PORT || 3000);

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

  app.use(bodyParser());

  app.use(express["static"](path.join(__dirname, 'public')));

  app.get('/:collection', function(req, res) {
    var params;
    params = req.params;
    return collectionDriver.findAll(req.params.collection, function(error, objs) {
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.status(200).send(objs);
      }
    });
  });

  app.get('/:collection/:entity', function(req, res) {
    var collection, entity, params;
    params = req.params;
    collection = params.collection;
    entity = params.entity;
    if (entity) {
      return collectionDriver.get(collection, entity, function(error, objs) {
        if (error) {
          return res.status(400).send(error);
        } else {
          return res.status(200).send(objs);
        }
      });
    } else {
      return res.status(400).send({
        error: 'bad url',
        url: req.url
      });
    }
  });

  app.post('/:collection', function(req, res) {
    var collection, object;
    object = req.body;
    collection = req.params.collection;
    return collectionDriver.save(collection, object, function(error, docs) {
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.status(201).send(docs);
      }
    });
  });

  app.put('/:collection/:entity', function(req, res) {
    var collection, entity, error, params;
    params = req.params;
    entity = params.entity;
    collection = params.collection;
    if (typeof eneity !== "undefined" && eneity !== null) {
      return collectionDriver.update(collection, req.body, entity, function(error, objs) {
        if (error != null) {
          return res.status(400).send(error);
        } else {
          return res.status(200).send(objs);
        }
      });
    } else {
      error = {
        "message": "Cannot PUT a whole collection"
      };
      return res.status(400).send(error);
    }
  });

  app["delete"]('/:collection/:entity', function(req, res) {
    var collection, entity, error, params;
    params = req.params;
    collection = params.collection;
    entity = params.entity;
    if (entity != null) {
      return collectionDriver["delete"](collection, entity, function(error, objs) {
        if (error != null) {
          return res.status(400).send(error);
        } else {
          return res.sendStatus(200);
        }
      });
    } else {
      error = {
        "message": "Cannot Delete a whole collection!"
      };
      return res.status(400).send(error);
    }
  });

  app.listen(3000, function() {
    return console.log('Server listening on port 3000...');
  });

}).call(this);
