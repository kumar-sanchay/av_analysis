
const ChatRoom = require('../models/Chatroom')

const getData = (req, res) => {
    console.log(req.query)
    ChatRoom.find({}, (error, chatroom)=>{

        if(error){
            res.sendStatus(500)
        }
        res.json(chatroom)
        
    })
    
}

module.exports = getData