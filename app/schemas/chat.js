const mongoose = require('mongoose');
const mongooseTypes = require('./mongooseTypes');

const schema = new mongoose.Schema({
    name: String,
    members: [mongooseTypes.idType],
    messages: [mongooseTypes.messageType],
    last_message: mongooseTypes.messageType,
    created: Number,
    modified: Number,
});
const model = mongoose.model('chats', schema);
module.exports = model;