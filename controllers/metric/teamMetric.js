const ChatRoom = require('../../models/Chatroom')

const teamMetric = async (req, res) => {

    let query = req.query


    if('teams' in query && 'date' in query && 'status' in query && 'channels' in query){
        let date_range = req.query.date
        date_range = date_range.split("|")

        let team = req.query.teams
        team = team.split("|")
        let teams = team.map((x)=>{
            return parseInt(x)
        })

        let status = req.query.status
        status = status.split("|")

        let channels = req.query.channels
        channels = channels.split("|")
        await statusTeamDateFilter(status, teams, date_range, channels, res)
    }else{
        res.sendStatus(500)
    }
    
}

const statusTeamDateFilter = (status, team, date_range, channels, res) =>{
    ChatRoom.aggregate([
        {
            $match:{
                chatbot_type: {$in: channels}
            }
        },
        {
            $match:{
                status: {$in: status}
            }
        },
        {
            $match:{
                assigned_team: {$in: team}
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
            $group:{_id:{team_id:"$assigned_team", status:"$status"}, count:{$sum:1}}
        },
        {
            $group:{_id:{team_id:"$_id.team_id"},
            status:{
                    $push:{
                        status:"$_id.status",
                        count: "$count"
                    }
                }
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
module.exports = teamMetric