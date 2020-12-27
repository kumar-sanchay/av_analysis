const ChatRoom = require('../../models/Chatroom')

const operatorMetric = (res, req) =>{

    const query = req.query

    if('operators' in query && 'teams' in query && 'status' in query && 'date' in query){

        let operators = query.operators
        operators = operators.split("|")

        let teams = query.teams
        teams = teams.split("|")

        let status = query.status
        status = status.split("|")

        
    }

}

const teamOperatorStatusDateFilter = (teams, operators, status, date_range) =>{

    ChatRoom.aggregate([
        {
            $match:{
                assigned_team:{$in: teams}
            }
        },
        {
            $match:{
                status:{$in: status}
            }
        },
        {
            $match:{
                assigned_operator:{$in: operators}
            }
        },
        {
            $match:{
                created_on:{
                    $gte: new Date(date_range[0]),
                    $lt: new Date(date_range[1])
                }
            }
        },
        {
            $group:{
                _id: "$assigned_operator",
                count:{$sum:1}
            }
        }
    ])
    .then(chatroom=>{
        res.json(chatroom)
    })
    .catch(err=>{
        console.log(err)
        res.sndStatus(500)
    })
}  

module.exports = operatorMetric