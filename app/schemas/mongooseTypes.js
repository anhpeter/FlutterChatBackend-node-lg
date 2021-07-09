const mongoose = require('mongoose');
const mongooseTypes = {
    idType: mongoose.Schema.Types.ObjectId,
    avatarType: {
        thumb_url: String,
        original_url: String,
    },
    get shortUserType() {
        return {
            _id: this.idType,
            username: String,
            fullname: String,
            avatar: this.avatarType,
        }
    },
    get historyType() {
        return {
            by: this.idType,
            timestamp: Number,
        }
    },
    get messageType() {
        return {
            _id: this.idType,
            sender_id: this.shortUserType,
            message_reply_id: this.idType,
            text: String,
            message_type: String,
            attach_url: String,
            timestamp: Number,
        }
    }
}

module.exports = mongooseTypes;