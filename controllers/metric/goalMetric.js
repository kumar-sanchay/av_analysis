const ChatRoom = require('../../models/Chatroom')

const goalMetric = async (req, res) => {

    const query = req.query

    if('room_id' in query && 'date_range' in query){
        const room_id = query.room_id
        let date_range = query.date_range
        date_range = date_range.split("|")

        await goalMetricFilter(room_id, date_range, res)
    }else{
        res.sendStatus(500)
    }
}

const goalMetricFilter = (room_id, date_range, res) => {

    ChatRoom.aggregate([
        {
            $match:{
                room_id: {$eq:room_id},
                updated_on:{
                    $gte: new Date(date_range[0]),
                    $lt: new Date(date_range[1])
                }
            }
        },
        {
            $group:{
                _id:{result: {$cond:{if:{$eq:["$variables.@goal", true]}, then:true, else:false}}},
                count:{$sum:1}
            }
        
        },
    ])
    .then(chatroom=>{
        let final_result = new Object()

        let goal_true = 0
        let goal_false = 0
        let goal_percentage = 0

        try{
            goal_true = chatroom[0]._id.result==true?chatroom[0].count:chatroom[1].count
        }catch(e){
            goal_true = 0
        }

        try{
            goal_false = chatroom[0]._id.result==false?chatroom[0].count:chatroom[1].count
        }catch(e){
            goal_false = 0
        }

        try{
            goal_percentage = (goal_true/(goal_true+goal_false)) * 100
        }catch(e){
            goal_percentage = 0
        }
        
        final_result.goal_percentage = goal_percentage
        chatroom.push(final_result)
        res.json(chatroom)
    })
    .catch(err=>{
        console.log(err)
        res.sendStatus(500)
    })
} 

module.exports = goalMetric