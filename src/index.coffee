express = require('express')
bodyParser = require('body-parser')

app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/notes', (req, res) ->
    res.send('<h1>Just a test msg no biggie! ;) </h1>')
)

app.post('/notes', (req, res) ->
    req.user.customData.notes = req.body.notes
    req.user.customData.save()
    req.status(200).end()
)

# app.post('')

app.listen(3000)
