const ChatRoom = require('../../models/Chatroom')

const botVisitorMetric = (req, res) => {

    const query = req.query

    if("room_id" in query && "type" in query && "date_range" in query){
        const room_id = query.room_id
        const type_api = query.type
        
        let date_range = query.date_range
        date_range = date_range.split("|")

        if(type_api==="visitor")
            botVisitorFilter(room_id, date_range, res)
        else if(type_api==="conversation")
            botConversationFilter(room_id, date_range, res)
        else res.sendStatus(500)

    }else{
        res.sendStatus(500)
    }

}

const botVisitorFilter = (room_id, date_range, res) => {

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
            $group:{
                _id:"$room_id",
                total_bot_visitors:{$sum:1}
            }
        }
    ])
    .then(chatroom=>{
        res.json(chatroom)
    })
    .catch(err=>{
        console.log(err)
        res.sendStatus(500)
    })
}

const botConversationFilter = (room_id, date_range, res) => {

    ChatRoom.aggregate([
        {
            $match:{
                room_id:{$eq:room_id},
                updated_on:{
                    $gte: new Date(date_range[0]),
                    $lt: new Date(date_range[1])
                }
                // messages:{$gte:[{$size:"messages"}, 1]}
            }
        },
        {
            $group:{
                _id:{room_id:"$room_id", is_conversation:{$cond:{ if: {$eq:[{$in:["user", "$messages.user"]}, true]},
                                                                    then:true, else:false}}},
                count:{$sum:1}
            }
        }
    ])
    .then(chatroom=>{
        let final_result = new Object()
        let conv = chatroom[0]._id.is_conversation==true?chatroom[0].count:chatroom[1].count
        let non_conv = chatroom[0]._id.is_conversation==false?chatroom[0].count:chatroom[1].count

        let conv_rate = (conv/(non_conv+conv)) * 100

        final_result.conversational_rate = conv_rate
        chatroom.push(final_result)
        res.json(chatroom)
    })
    .catch(err=>{
        console.log(err)
        res.sendStatus(500)
    })
}
module.exports = botVisitorMetric