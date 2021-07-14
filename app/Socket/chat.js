const SocketEventName = require('../defines/Socket/SocketEventName');
const mongoose = require('mongoose');
const onlineUsers = require('../realtime/onlineUsers');
const MyTime = require('../defines/MyTime');
const Helper = require('../defines/Helper');
const chatModel = require('../models/chat');

const supportFn = {
    getCurrentChatIdFormat: (chatId) => {
        return `${chatId}_current`;
    }
};

const chat = (io) => {
    io.on('connection', (socket) => {
        //socket.on(SocketEventName.signIn, (data) => {
        //socket.join(data.user._id);

        //// get all chat
        //chatModel.listIdsByUserId(data.user._id, (err, result) => {
        //if (!err) {
        //if (result.length > 0) {
        //const items = Helper.getArrayOfFieldValue(result, '_id', 'string');
        //socket.join(items);
        //}
        //}
        //});
        //});

        socket.on(SocketEventName.sendMessage, (data) => {
            const { user, message, chatId } = data;
            const item = {
                _id: mongoose.Types.ObjectId(),
                sender: user,
                text: message,
                timestamp: Date.now(),
            };
            chatModel.addMessageToChatById(chatId, item).then(result=>{
                socket.to(supportFn.getCurrentChatIdFormat(chatId)).emit(SocketEventName.receiveMessage, { message: item, chatId });

                //// notify
                //io.to(chatId).emit(SocketEventName.newMessageNotification, { message: item, chatId });
            });
        });

        socket.on(SocketEventName.typing, (data) => {
            const { chatId } = data;
            socket.to(supportFn.getCurrentChatIdFormat(chatId)).emit(SocketEventName.typing, data);
        });

        socket.on(SocketEventName.stopTyping, (data) => {
            const { chatId } = data;
            socket.to(supportFn.getCurrentChatIdFormat(chatId)).emit(SocketEventName.stopTyping, data);
        });

        socket.on('disconnecting', function() {});
    });
};
module.exports = chat;