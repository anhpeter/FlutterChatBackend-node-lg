const mongoose = require('mongoose');
const model = require('../schemas/chat');
const Model = require('./Model');
const MyTime = require('../defines/MyTime');
const chatModel = {
    ...Model,

    // list
    listAll: function() {
        return this.getModel().find({});
    },

    listIdsByUserId: function(id) {
        return this.getModel().find({
            members: new mongoose.Types.ObjectId(id),
        }, {}, {
            select: "_id"
        });
    },

    // find
    findInfoByUserIdsOrCreateIfNotExist: async function(ids) {
        try {
            const result = await this.getModel().findOne({
                members: this.getMemberIdsMatch(ids),
            }, {
                _id: 1,
                members: 1,
            }, (err, result) => {});

            if (result != null) return result;

            // not found
            const item = {
                members: ids,
                created: MyTime.getUTCNow(),
            }
            return this.insert(item)
        } catch (e) {
            console.log("insert err", e);
        }
    },

    createChatByMemberIds: function(ids, message) {
        const item = {
            members: ids,
            messages: [],
            created: MyTime.getUTCNow(),
        }
        if (message) {
            item.messages.push(message);
            item.lastMessage = message;
        }
        return this.insert(item);
    },

    findByUserIds: function(ids) {
        return this.getModel().findOne({
            members: {
                $size: ids.length,
                $elemMatch: {
                    _id: {
                        $in: ids
                    }
                }
            }
        });
    },

    findById: function(id) {
        return this.getModel().findOne({ _id: id });
    },

    findByMemberIds: function(ids) {
        return this.getModel().findOne({
            members: this.getMemberIdsMatch(ids)
        });
    },

    findSidebarItemById: function(id) {
        return this.getModel().aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            this.getMembersLookup(),
            this.getSidebarItemProjection(),
            {
                $limit: 1,
            }
        ]);
    },

    listItemsForListDisplay: function(id) {
        return this.getModel().aggregate([{
                $match: {
                    members: new mongoose.Types.ObjectId(id),
                    lastMessage: {
                        $exists: true
                    }
                }
            },
            this.getMembersLookup(),
            this.getSidebarItemProjection(),
            {
                $sort: {
                    'lastMessage.time': -1
                }
            }
        ]);
    },

    // manipulation
    insert: function(object) {
        const item = new this.getModel()(object);
        return item.save();
    },

    // add messages
    addMessageToChatById: function(id, message) {
        return this.getModel().findOneAndUpdate({
            _id: id,
        }, {
            lastMessage: message,
            $push: { messages: message }
        }, {
            select: 'members',
        })
    },

    getModel: function() {
        return model;
    },

    // options
    getMemberIdsMatch: function(ids) {
        ids = this.convertStringArrayToObjectIdArray(ids);
        return {
            $size: ids.length,
            $all: ids,
        }
    },

    getMembersLookup: function() {
        return {
            $lookup: {
                from: "users",
                let: { the_members: "$members", },
                pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$the_members"] }
                                ]
                            }
                        },
                    },
                    {
                        $project: {
                            username: 1,
                            picture: 1,
                        }
                    }
                ],
                as: "members"
            },
        }
    },

    getSidebarItemProjection: function() {
        return {
            $project: {
                name: 1,
                members: 1,
                lastMessage: 1,
            }
        }
    },

    // 
    reset: async function(callback) {
        await this.getModel().deleteMany({});
    }

}
module.exports = chatModel;