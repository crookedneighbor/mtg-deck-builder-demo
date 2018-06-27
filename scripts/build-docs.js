'use strict'

const exec = require('child_process').execSync
const fs = require('fs')
const path = require('path')

fs.readdir('./src/pages', (err, files) => {
  files.forEach((fileWithExtension) => {
    const file = path.basename(fileWithExtension, '.vue')

    exec(`cp ./index.html ./${file}.html`)
  })
})
