const dummyUsers = require('../dummy_data/dummy_users');
const model = require('../schemas/user');
const { convertStringToMongooseObjectId } = require('./Model');
const Model = require('./Model');
const userModel = {
    ...Model,

    listAll: function() {
        return this.getModel().find();
    },

    listUserWithParams: function(query) {
        const {skip = 0, limit = 50} = query;
        const queryObj = [
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $sort: {
                    last_active: -1
                }
            },
        ];
        return this.getModel().aggregate(queryObj);
    },

    // FIND
    findUsersByIds: function(ids) {
        ids = ids.map((id) => {
            return this.convertStringToMongooseObjectId(id);
        });
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

    findByUid: function(uid) {
        return this.getModel().findOne({uid});
    },

    // INSERT 
    insert: function(object) {
        const item = new this.getModel()(object);
        return item.save();
    },

    createNewAccount: function(item){
        const {email, password, uid, avatar_url, fullname, username} = item;
        item = {
            username, email, password, uid, avatar_url,fullname,
            created: Date.now(),
            last_active: Date.now(),
        };
        return this.insert(item);
    },

    getOrCreateUserIfNotExist: async function(item){
        const {uid} = item;
        const existingItem = await this.getModel().findOne({uid});
        if (existingItem) 
            return existingItem;
        return this.createNewAccount(item);
    },

    // UPDATE
    updateLastActiveById: function(id){
        return this.getModel().updateOne({_id: convertStringToMongooseObjectId(id)}, {
            $set: {
                last_active: Date.now(),
            }
        });
    },

    // OTHER
    reset: async function(admin) {
        const deleteResult = await this.deleteAuthUsers(admin);
        await this.getModel().deleteMany();
        const promises = [];

        // add user
        dummyUsers.forEach(item=>{
            const promise = new Promise((resolve)=>{
                admin
                    .auth()
                    .createUser({
                        email:item.email,
                        password:item.password,
                    })
                    .then((userRecord) => {
                        resolve({
                            ...item,
                            uid: userRecord.uid
                        });
                    });
            });
            promises.push(promise);
        });
        const data = await Promise.all(promises);
        return this.getModel().insertMany(data);
    },

    deleteAuthUsers: async function(admin){
        return admin
            .auth()
            .listUsers(1000)
            .then((listUsersResult) => {
                const uids = [];
                listUsersResult.users.forEach((userRecord) => {
                    uids.push(userRecord.uid);
                });
                return admin
                    .auth()
                    .deleteUsers(uids);
            });
    },

    getInitialData: function() {
        const items = [{
            username: 'peteranh',
            password: 'admin',
            avatar_url: 'https://scontent.fpnh22-3.fna.fbcdn.net/v/t1.6435-9/204065591_1762191777316711_7730942647747491134_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=xLfB-T3CGAwAX8udkbR&_nc_ht=scontent.fpnh22-3.fna&oh=60059069bb86d74b021d9612e9d8c6ed&oe=60EECC6D', 

        },
        {
            username: 'peterkhang',
            password: 'admin',
            avatar_url: 'https://scontent.fpnh22-2.fna.fbcdn.net/v/t1.6435-9/167493141_1912654948911952_7955682796671963256_n.jpg?_nc_cat=101&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=mLkniF3-XRIAX9IvkoI&tn=tVTkhA5WDqz-Q1eV&_nc_ht=scontent.fpnh22-2.fna&oh=1cd66fc61277ae7487ad0e7a80671e08&oe=60EDECBC', 
        },
        {
            username: 'rose',
            password: 'admin',
            avatar_url: 'https://i.pinimg.com/originals/76/fa/eb/76faeb9c818efdf76cf066aea3685a80.jpg', 
        },
        {
            username: 'lisa',
            password: 'admin',
            avatar_url: 'https://assets.vogue.com/photos/5ebc71d4a85f0288b7c3efda/16:9/w_3376,h_1899,c_limit/lisa-promo-crop.jpg', 
        },
        {
            username: 'jisoo',
            password: 'admin',
            avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Kim_Ji-soo_at_Jimmy_Choo_Event_on_January_09%2C_2020_%287%29.jpg', 
        },
        {
            username: 'jennie',
            password: 'admin',
            avatar_url: 'https://cdn1.i-scmp.com/sites/default/files/styles/768x768/public/images/methode/2019/01/16/07a7ab2a-17ce-11e9-8ff8-c80f5203e5c9_image_hires_160333.jpg?itok=SYxUEfvx&v=1547625814', 
        },
        ];
        return items;
    },

    getModel: function() {
        return model;
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
};
module.exports = userModel;