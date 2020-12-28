const ChatRoom = require('../../models/Chatroom')

const operatorMetric = async (res, req) =>{

    const query = req.query

    if('operators' in query && 'teams' in query && 'status' in query && 'date' in query){

        let operators = query.operators
        operators = operators.split("|")

        let teams = query.teams
        teams = teams.split("|")

        let status = query.status
        status = status.split("|")

        let date_range = req.query.date
        date_range = date_range.split("|")

        await teamOperatorStatusDateFilter(teams, operators, status, date_range, res)
        
    }

}

const teamOperatorStatusDateFilter = (teams, operators, status, date_range, res) =>{

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
                _id: {assigned_operator:"$assigned_operator", status:"$status"},
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