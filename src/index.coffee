express = require 'express'
path = require 'path'
bodyParser = require 'body-parser'
MongoClient = require('mongodb').MongoClient
Server = require('mongodb').Server
CollectionDriver = require './CollectionDriver.js'

app = express()

app.set 'port', process.env.PORT || 3000

mongoHost = 'localhost'
mongoPort = 27017
collectionDriver = ""

mongoClient = new MongoClient(new Server(mongoHost, mongoPort))
mongoClient.open (err, mongoClient) ->
  if !mongoClient
    console.error "Error! Exiting... No MongoDB found."
    process.exit(1)
  db = mongoClient.db "MyDatabase"
  collectionDriver = new CollectionDriver db

app.use bodyParser()
app.use express.static path.join __dirname, 'public'

app.get('/:collection', (req, res) ->
  params = req.params
  collectionDriver.findAll(req.params.collection, (error, objs) ->
    if error then res.status(400).send(error)
    else res.status(200).send(objs)))

app.get('/:collection/:entity', (req, res) ->
  params = req.params
  collection = params.collection
  entity = params.entity
  if entity
    collectionDriver.get(collection, entity, (error, objs) ->
      if error then res.status(400).send(error)
      else res.status(200).send(objs))
  else res.status(400).send {error: 'bad url', url: req.url})

app.post('/:collection', (req, res) ->
  object = req.body
  collection = req.params.collection
  collectionDriver.save(collection, object, (error, docs) ->
    if error then res.status(400).send(error)
    else res.status(201).send(docs)))

app.put('/:collection/:entity', (req, res) ->
  params = req.params
  entity = params.entity
  collection = params.collection
  if eneity? then collectionDriver.update(
    collection,
    req.body,
    entity,
    (error, objs) ->
      if error? then res.status(400).send error
      else res.status(200).send objs)
  else
    error = { "message": "Cannot PUT a whole collection" }
    res.status(400).send error)

app.delete('/:collection/:entity', (req, res) ->
  params = req.params
  collection = params.collection
  entity = params.entity
  if entity? then collectionDriver.delete(collection, entity, (error, objs) ->
    if error? then res.status(400).send error
    else res.sendStatus 200)
  else
    error = { "message": "Cannot Delete a whole collection!" }
    res.status(400).send error)

app.listen(3000, -> console.log 'Server listening on port 3000...')
