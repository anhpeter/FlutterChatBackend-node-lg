const mongoose = require('mongoose');
const model = require('../schemas/user');
const Model = require('./Model');
const userModel = {
    ...Model,

    listAll: function() {
        return this.getModel().find({});
    },

    // FIND
    findUsersByIds: function(ids) {
        ids = ids.map((id) => {
            return new mongoose.Types.ObjectId(id);
        })
        return this.getModel().find({
            _id: {
                $in: ids
            }
        });
    },

    findById: function(id) {
        return this.getModel().findById(id);
    },

    findByUsernameAndPassword: function(username, password) {
        return this.getModel().findOne({ username, password });
    },

    //findStrangerByUsername(username, callback) {
    //this.getModel().aggregate([{
    //$match: {
    //username
    //},
    //},
    //{
    //$project: {
    //_id: 0,
    //'friend': '$friend.friend',
    //'request': '$friend.request',
    //'sent_request': '$friend.sent_request',
    //}
    //}
    //], (err, docs) => {
    //if (docs.length > 0) {
    //docs.forEach((doc) => {
    //let ids = [...doc.friend, ...doc.sent_request, ...doc.request];
    //ids = ids.map((id) => {
    //return new mongoose.Types.ObjectId(id);
    //})
    //this.getModel().find({
    //_id: {
    //$nin: ids
    //},
    //username: {
    //$ne: username
    //}
    //}, (err, docs) => {
    //if (Helper.isFn(callback)) callback(err, docs);
    //})
    //})
    //} else if (Helper.isFn(callback)) callback(err, docs);
    //})
    //},

    //findSentRequestFriendById(id, callback) {
    //this.getModel().aggregate([{
    //$match: {
    //_id: id
    //},
    //},
    //{
    //$project: {
    //_id: 0,
    //'sent_request': '$friend.sent_request',
    //}
    //}
    //], (err, docs) => {
    //if (docs.length > 0) {
    //docs.forEach((doc) => {
    //let ids = doc.sent_request;
    //ids = ids.map((id) => {
    //return new mongoose.Types.ObjectId(id);
    //})
    //this.getModel().find({
    //_id: {
    //$in: ids
    //},
    //}, (err, docs) => {
    //if (Helper.isFn(callback)) callback(err, docs);
    //})
    //})
    //} else if (Helper.isFn(callback)) callback(err, docs);
    //})
    //},

    //findFriendsByUsername(username, callback) {
    //this.getModel().aggregate([{
    //$match: {
    //username
    //},
    //},
    //{
    //$project: {
    //'friend': '$friend.friend',
    //}
    //}
    //], (err, docs) => {
    //if (docs.length > 0) {
    //docs.forEach((doc) => {
    //let ids = doc.friend;
    //if (ids.length > 0) {
    //ids = ids.map((id) => {
    //return new mongoose.Types.ObjectId(id);
    //})
    //this.getModel().find({
    //_id: {
    //$in: ids
    //},
    //}, (err, docs) => {
    //if (Helper.isFn(callback)) callback(err, docs);
    //})
    //} else if (Helper.isFn(callback)) callback(err, docs);
    //})
    //} else if (Helper.isFn(callback)) callback(err, docs);
    //})
    //},

    //findByUsername: function(username, callback) {
    //this.getModel().find({ username }, (err, docs) => {
    //const [doc] = docs;
    //if (Helper.isFn(callback)) callback(err, doc);
    //})
    //},

    //findReceivers: function(username, exceptIds, callback) {
    //this.getModel().aggregate([{
    //$match: {
    //username: {
    //$regex: `${username}.*`,
    //$options: `i`
    //},
    //_id: {
    //$nin: this.convertStringArrayToObjectIdArray(exceptIds),
    //},
    //}
    //},
    //{
    //$project: {
    //username: 1,
    //picture: 1
    //}
    //}
    //], (err, docs) => {
    //if (Helper.isFn(callback)) callback(err, docs);
    //})
    //},

    // INSERT 
    insert: function(object) {
        const item = new this.getModel()(object);
        return item.save();
    },

    // OTHER
    reset: async function() {
        await this.getModel().deleteMany();
        return this.getModel().insertMany(this.getInitialData());
    },

    getInitialData: function() {
        const items = [{
                username: 'peteranh',
                password: 'admin',
                avatar: { thumb: 'https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.0-9/61103469_1109770422558853_2564158225184194560_n.jpg?_nc_cat=104&ccb=2&_nc_sid=09cbfe&_nc_ohc=BJ6L5IV_JfQAX8iDLtk&_nc_ht=scontent.fsgn2-5.fna&oh=ccf7880a2a77ee48a2fdf6663f3050c0&oe=6049EB1D', },

            },
            {
                username: 'peterkhang',
                password: 'admin',
                avatar: { thumb: 'https://scontent.fsgn2-3.fna.fbcdn.net/v/t1.0-9/137561041_1853205284856919_7590474778452561765_o.jpg?_nc_cat=108&ccb=2&_nc_sid=09cbfe&_nc_ohc=Wh8AsYFtNE8AX8ZUxrZ&_nc_ht=scontent.fsgn2-3.fna&oh=5fd70fba323c9d72da5caa2ebd1e00ef&oe=604836B2', },
            },
            {
                username: 'rose',
                password: 'admin',
                avatar: { thumb: 'https://i.pinimg.com/originals/76/fa/eb/76faeb9c818efdf76cf066aea3685a80.jpg', },
            },
            {
                username: 'lisa',
                password: 'admin',
                avatar: { thumb: "https://assets.vogue.com/photos/5ebc71d4a85f0288b7c3efda/16:9/w_3376,h_1899,c_limit/lisa-promo-crop.jpg" },
            },
            {
                username: 'jisoo',
                password: 'admin',
                avatar: { thumb: "https://upload.wikimedia.org/wikipedia/commons/3/38/Kim_Ji-soo_at_Jimmy_Choo_Event_on_January_09%2C_2020_%287%29.jpg" },
            },
            {
                username: 'jennie',
                password: 'admin',
                avatar: { thumb: "https://cdn1.i-scmp.com/sites/default/files/styles/768x768/public/images/methode/2019/01/16/07a7ab2a-17ce-11e9-8ff8-c80f5203e5c9_image_hires_160333.jpg?itok=SYxUEfvx&v=1547625814" },
            },
        ];
        return items;
    },

    getModel: function() {
        return model;
    },

    //unfriendById: function(id, friendId, callback) {
    //let promises = [];
    //// update user
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: id }, { $pull: { 'friend.friend': new mongoose.Types.ObjectId(friendId), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //// update friend
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: friendId }, { $pull: { 'friend.friend': new mongoose.Types.ObjectId(id), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //Promise.all(promises)
    //.then((promisesResult) => {
    //let result = this.getResultByMultiUpdatedResult(promisesResult);
    //if (Helper.isFn(callback)) callback(result.err, result.result);
    //})
    //},
    //sentFriendRequestById: function(id, friendId, callback) {
    //let promises = [];
    //// update user
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: id }, { $addToSet: { 'friend.sent_request': new mongoose.Types.ObjectId(friendId), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //// update friend
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: friendId }, { $addToSet: { 'friend.request': new mongoose.Types.ObjectId(id), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //Promise.all(promises)
    //.then((promisesResult) => {
    //let result = this.getResultByMultiUpdatedResult(promisesResult);
    //if (Helper.isFn(callback)) callback(result.err, result.result);
    //})
    //},
    //deleteFriendRequest: function(id, friendId, callback) {
    //let promises = [];
    //// update user
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: id }, { $pull: { 'friend.request': new mongoose.Types.ObjectId(friendId), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //// update friend
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: friendId }, { $pull: { 'friend.sent_request': new mongoose.Types.ObjectId(id), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //Promise.all(promises)
    //.then((promisesResult) => {
    //let result = this.getResultByMultiUpdatedResult(promisesResult);
    //if (Helper.isFn(callback)) callback(result.err, result.result);
    //})
    //},
    //cancelFriendRequest: function(id, friendId, callback) {
    //let promises = [];
    //// update user
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: id }, { $pull: { 'friend.sent_request': new mongoose.Types.ObjectId(friendId), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //// update friend
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: friendId }, { $pull: { 'friend.request': new mongoose.Types.ObjectId(id), }, },
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //Promise.all(promises)
    //.then((promisesResult) => {
    //let result = this.getResultByMultiUpdatedResult(promisesResult);
    //if (Helper.isFn(callback)) callback(result.err, result.result);
    //})
    //},
    //confirmFriendRequest: function(id, friendId, callback) {
    //let promises = [];

    ////request
    //// update user
    //const friendObjectId = new mongoose.Types.ObjectId(friendId);
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: id }, {
    //$pull: { 'friend.request': friendObjectId, },
    //$addToSet: { 'friend.friend': friendObjectId, },
    //},
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //// update friend
    //const objectId = new mongoose.Types.ObjectId(id);
    //promises.push(
    //new Promise((resolve) => {
    //this.getModel().updateOne({ _id: friendId }, {
    //$pull: { 'friend.sent_request': objectId, },
    //$addToSet: { 'friend.friend': objectId, },
    //},
    //(err, result) => {
    //resolve(this.getUpdatedResult(err, result));
    //}
    //)
    //})
    //)

    //Promise.all(promises)
    //.then((promisesResult) => {
    //let result = this.getResultByMultiUpdatedResult(promisesResult);
    //if (Helper.isFn(callback)) callback(result.err, result.result);
    //})
    //}
}
module.exports = userModel;