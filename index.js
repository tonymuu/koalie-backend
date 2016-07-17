(function() {
  var app, bodyParser, express;

  express = require('express');

  bodyParser = require('body-parser');

  app = express();

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.get('/notes', function(req, res) {
    return res.send('<h1>Just a test msg no biggie! ;) </h1>');
  });

  app.post('/notes', function(req, res) {
    req.user.customData.notes = req.body.notes;
    req.user.customData.save();
    return req.status(200).end();
  });

  app.listen(3000);

}).call(this);
