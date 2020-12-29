const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { json, query } = require('express')

mongoose.connect('mongodb://localhost/chat360', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.listen(3000, ()=>{
    console.log('Started server')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const postData = require('./controllers/postData')
const getData = require('./controllers/getData')
const teamMetric = require('./controllers/metric/teamMetric')
const operatorMetric = require('./controllers/metric/operatorMetric')
const deleteRoomData = require('./controllers/deleteRoomData')
const totalMessages = require('./controllers/metric/totalMessages')
const goalMetric = require('./controllers/metric/goalMetric')
const totalBotVisitors = require('./controllers/metric/botVisitorMetric')

app.post('/api/analysis/post-room-data', postData)
app.get('/api/analysis/get-room-data', getData)
app.get('/api/analysis/teamMetric', teamMetric)
app.get('/api/analysis/operatorMetric', operatorMetric)
app.delete('/api/analysis/delete-room-data', deleteRoomData)
app.get('/api/analysis/bot-msg-data', totalMessages)
app.get('/api/analysis/bot-goal-data', goalMetric)
app.get('/api/analysis/total-bot-visitors', totalBotVisitors)

