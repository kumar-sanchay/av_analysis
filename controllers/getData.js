
const ChatRoom = require('../models/Chatroom')

const getData = async (req, res) => {
    console.log(req.query)
    await ChatRoom.find({}, (error, chatroom)=>{

        if(error){
            res.sendStatus(500)
        }
        res.json(chatroom)
        
    })
    
}

module.exports = getData