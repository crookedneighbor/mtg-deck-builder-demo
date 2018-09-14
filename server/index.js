'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('dist'))

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '..', 'views/index.html'))
})

var listener = app.listen(process.env.PORT || 8080, function () {
  console.log('Your app is listening on port http://localhost:' + listener.address().port)
})
