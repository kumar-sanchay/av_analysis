
const ChatRoom = require('../models/Chatroom')

const postData = async (req, res) => {
    await ChatRoom.create(req.body, (error, chatroom)=>{

        if(error){
            res.sendStatus(500)
        }else{
            res.sendStatus(200)
        }
    })
}

module.exports = postData