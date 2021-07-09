const mongoose = require('mongoose');
const mongooseTypes = require('./mongooseTypes');

const schema = new mongoose.Schema({
    name: String,
    members: [mongooseTypes.shortUserType],
    messages: [mongooseTypes.messageType],
    lastMessage: mongooseTypes.messageType,
    created: mongooseTypes.historyType,
    modified: mongooseTypes.historyType,
});
const model = mongoose.model('chats', schema);
module.exports = model;