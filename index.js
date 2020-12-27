const express = require('express')
const app = express()
const mongoose = require('mongoose')
const BodyParser = require('body-parser')
const { json, query } = require('express')

mongoose.connect('mongodb://localhost/chat360', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.listen(3000, ()=>{
    console.log('Started server')
})

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

const postData = require('./controllers/postData')
const getData = require('./controllers/getData')
const teamMetric = require('./controllers/metric/teamMetric')
const dummy = require('./controllers/dummy')

app.post('/api/post-room-data', postData)
app.get('/api/get-room-data', getData)
app.get('/api/teamMetric', teamMetric)
app.get('/api/dummy', dummy)

