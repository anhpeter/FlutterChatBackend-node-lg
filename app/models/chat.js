const mongoose = require('mongoose');
const model = require('../schemas/chat');
const Model = require('./Model');
const MyTime = require('../defines/MyTime');
const userModel = require('./user');
const dummyChats = require('../dummy_data/dummy_chats');

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
            select: '_id'
        });
    },

    // find
    findInfoByUserIdsOrCreateIfNotExist: async function(ids) {
        let result = await this.findByMemberIds(ids);
        if (result == null){
            result = await this.createChatByMemberIds(ids);
        }

        // not found
        return {
            ...result.toObject(),
            members: await userModel.findUsersByIds(result.members),
        };
    },

    createChatByMemberIds: function(ids, message) {
        const item = {
            members: ids,
            messages: [],
            created: Date.now(),
        };
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

    findById: async function(id) {
        const result = await this.getModel().findOne({ _id: id });
        return {
            ...result.toObject(),
            members: await userModel.findUsersByIds(result.members),
        };
    },

    getBriefItemById: function(id) {
        return this.getModel().aggregate([{
            $match: {
                _id: new mongoose.Types.ObjectId(id),
                last_message: {
                    $exists: true
                }
            }
        },
        this.getMembersLookup(),
        this.getSidebarItemProjection(),
        ]);
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
                last_message: {
                    $exists: true
                }
            }
        },
        this.getMembersLookup(),
        this.getSidebarItemProjection(),
        {
            $sort: {
                'last_message.timestamp': -1
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
            last_message: message,
            $push: { messages: message }
        }, {
            select: 'members',
        });
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
        };
    },

    getMembersLookup: function() {
        return {
            $lookup: {
                from: 'users',
                let: { the_members: '$members', },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                { $in: ['$_id', '$$the_members'] }
                            ]
                        }
                    },
                },
                {
                    $project: {
                        username: 1,
                        fullname: 1,
                        avatar_url: 1,
                    }
                }
                ],
                as: 'members'
            },
        };
    },

    getSidebarItemProjection: function() {
        return {
            $project: {
                name: 1,
                members: 1,
                last_message: 1,
            }
        };
    },

    // 
    reset: async function(callback) {
        await this.getModel().deleteMany({});
        return this.getModel().insertMany(dummyChats);
    }

};
module.exports = chatModel;