const ChatRoom = require('../models/Chatroom')

const deleteRoomData = async (req, res) => {

    const query = req.query

    if('_id' in query || 'room_id' in query){

        await deleteData(query, res)
    }else{
        res.sendStatus(500)
    }
    
}

const deleteData = (query, res) =>{

    ChatRoom.deleteOne(query)
    .then(chatroom=>{
        res.sendStatus(200)
    })
    .catch(err=>{
        console.log(err)
        res.sendStatus(500)
    })
}

module.exports = deleteRoomData