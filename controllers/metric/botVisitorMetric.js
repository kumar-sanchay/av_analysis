const ChatRoom = require('../../models/Chatroom')

const botVisitorMetric = async (req, res) => {

    const query = req.query

    if("room_id" in query && "type" in query && "date_range" in query){
        const room_id = query.room_id
        const type_api = query.type
        
        let date_range = query.date_range
        date_range = date_range.split("|")

        if(type_api==="visitor")
            await botVisitorFilter(room_id, date_range, res)
        else if(type_api==="conversation")
            await botConversationFilter(room_id, date_range, res)
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
                _id:{room_id:"$room_id", is_conversation:{$cond:{ if: {$eq:[{$in:["end_user", "$messages.user"]}, true]},
                                                                    then:true, else:false}}},
                count:{$sum:1}
            }
        }
    ])
    .then(chatroom=>{
        console.log(chatroom)
        let final_result = new Object()
        let conv = 0
        let non_conv = 0
        let conv_rate = 0

        try{
            conv = chatroom[0]._id.is_conversation==true?chatroom[0].count:chatroom[1].count
        }catch(e){
            conv = 0
        }

        try{
            non_conv = chatroom[0]._id.is_conversation==false?chatroom[0].count:chatroom[1].count
        }catch(e){
            non_conv = 0
        }
        try{
            conv_rate = (conv/(non_conv+conv)) * 100
        }catch(e){
            conv_rate = 0
        }
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