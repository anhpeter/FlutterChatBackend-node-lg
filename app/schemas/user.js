const mongoose = require('mongoose');
const mongooseTypes = require('./mongooseTypes');

const schema = new mongoose.Schema({
    username: String,
    fullname: String,
    email: String,
    phone: String,
    password: String,
    created: mongooseTypes.historyType,
    avatar: mongooseTypes.avatarType,
    lastActive: Number,
});

const model = mongoose.model('users', schema);
module.exports = model;