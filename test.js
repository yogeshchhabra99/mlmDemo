const express = require('express')
const app = express()


app.get('/test', function (req, res) {
    res.send('Hello World2')
  })
   

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/sup', function (req, res) {
    res.send('Hello World3')
  })
   


app.listen(3000)