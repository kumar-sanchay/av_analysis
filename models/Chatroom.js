const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatRoomSchema = new Schema({
    visitor_id: Number,
    room_id: String,
    created_on: Date,
    room_name: String,
    chatbot_type:String,
    bot_is_active: Boolean,
    num_msgs: Number,
    is_lead: Boolean,
    status: String,
    takeover: Boolean,
    end_time: Date,
    admin_id: Number,
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    utm_term: String,
    utm_content: String,
    website_url: String,
    channel_id: String,
    assignment_type: String,
    assigned_operator: String,
    team_assignment_type: String,
    assigned_team: Number,
    end_chat: Boolean,
    updated_on: Date,
    variables: Object,
    messages: Object,
});


const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema)
module.exports = ChatRoom