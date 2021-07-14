const Helper = require('../defines/Helper');
const SocketEventName = require('../defines/Socket/SocketEventName');
const userModel = require('../models/user');
const MyModel = require('../models/user');
const onlineUsers = require('../realtime/onlineUsers');
const chat = require('./chat');
const friendAction = require('./friendAction');

const realtime = (io) => {
    //riendAction(io);
    chat(io);
    io.on('connection', (socket) => {
        id = socket.id;
        console.log('new connection ', id);

        const checkUserAndEmitIfOffline = (user) => {
            if (!onlineUsers.isUserOnline(user._id)){
                emitAllOnlineUsers();
                userModel.updateLastActiveById(user._id).then(result=>{
                });
                //socket.broadcast.emit(SocketEventName.onlineUserLeft, user);
            } 
        };
        const emitAllOnlineUsers = () => {
            io.emit(SocketEventName.onlineUsers, onlineUsers.getUsersArr());
        };

        socket.on(SocketEventName.signIn, (data) => {
            onlineUsers.addUser(data, socket.id);
            emitAllOnlineUsers();
            //socket.broadcast.emit(SocketEventName.newOnlineUser, data.user);
        });

        //socket.on(SocketEventName.joinUsersToChat, (data) => {
        //const { ids, chatId } = data;
        //onlineUsers.loopOnlineUsersByIds(ids, (item) => {
        //item.socketIds.forEach((socketId) => {
        //const clientSocket = io.of('/').sockets.get(socketId);
        //if (clientSocket) clientSocket.join(chatId);
        //});
        //});
        //});

        socket.on(SocketEventName.joinRoom, (data) => {
            if (data.roomName) socket.join(data.roomName);
        });

        socket.on(SocketEventName.leaveRoom, (data) => {
            if (data.roomName) socket.leave(data.roomName);
        });

        socket.on(SocketEventName.getOnlineUsers, () => {
            emitAllOnlineUsers();
        });

        //socket.on(SocketEventName.updateUser, (data) => {
        //const { id } = data;
        //const user = onlineUsers.findById(id);
        //if (user) {
        //const socketIds = user.socketIds;
        //MyModel.findById(user._id, (err, doc) => {
        //if (!err) {
        //socketIds.forEach((socketId) => {
        //io.to(socketId).emit(SocketEventName.updateUser, doc);
        //onlineUsers.updateById(id, doc);
        //})
        //}
        //})
        //}
        //})

        socket.on(SocketEventName.signOut, (data) => {
            onlineUsers.removeBySocketId(socket.id);
            //emitAllOnlineUsers();
            checkUserAndEmitIfOffline(data.user);
            //const rooms = socket.rooms;
            //rooms.forEach((roomName) => {
            //socket.leave(roomName);
            //});
        });

        socket.on('disconnecting', function() {
            const item = onlineUsers.removeBySocketId(socket.id);
            if (item) {
                checkUserAndEmitIfOffline(item);
            }

        });

    });
};
module.exports = realtime;