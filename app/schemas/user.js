const mongoose = require('mongoose');
const mongooseTypes = require('./mongooseTypes');

const schema = new mongoose.Schema({
    username: String,
    uid: String,
    fullname: String,
    email: String,
    phone: String,
    password: String,
    created: Number,
    modified: Number,
    avatar_url: String,
    last_active: Number,
});

const model = mongoose.model('users', schema);
module.exports = model;