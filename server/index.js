'use strict'

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')()
const path = require('path')
const app = express()

const PORT = 8080

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '..', 'views/index.html'))
})

db.connect().then(() => {
  const listener = app.listen(PORT, () => {
    console.log('Your app is listening on port http://localhost:' + listener.address().port)
  })

  db.add('documents', [
    {foo: 1}, {foo: 2}, {foo: 3}
  ]).then((result) => {
    console.log('result:')
    console.log(result)

    db.find('documents').then((result) => {
      console.log(result)
    })
  })
})
