const ChatRoom = require('../../models/Chatroom')

const totalMessages = async (req, res) => {

    const query = req.query

    if('room_id' in query && 'date_range' in query){
        const room_id = query.room_id
        let date_range = query.date_range
        date_range = date_range.split("|")

        await totalMessagesFilter(room_id, date_range, res)
    }else{

        res.sendStatus(500)
    }
}

const totalMessagesFilter = (room_id, date_range, res) =>{
    ChatRoom.aggregate([
        {
            $match:{
                room_id:{$eq:room_id},
                updated_on:{
                    $gte: new Date(date_range[0]),
                    $lt: new Date(date_range[1])
                }
            }
        },
        {
            $group: {
                _id:{$arrayElemAt:["$messages.user", 0]},
                count:{$sum:1}
            }
        }
        
    ])
    .then(chatroom=>{

        let final_result = new Object()
        let bot_chat_count = chatroom[0]._id=="bot"?chatroom[0].count:chatroom[1].count
        let end_user_count = chatroom[0]._id=="user"?chatroom[0].count:chatroom[1].count

        let bot_chat_percentage = (bot_chat_count/(bot_chat_count+end_user_count)) * 100
        let end_user_chat_percentage = (end_user_count/(bot_chat_count+end_user_count)) * 100
        let total_chat_count = bot_chat_count+end_user_count

        final_result.bot_chat_percentage = bot_chat_percentage
        final_result.end_user_chat_percentage = end_user_chat_percentage
        final_result.total_chat_count = total_chat_count

        chatroom.push(final_result)
        res.json(chatroom)
    })
    .catch(err=>{
        console.log(err)
        res.sendStatus(500)
    })
}

module.exports = totalMessages