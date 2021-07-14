const SchemaFields = {
    general: {
        id:'_id',
    },
    user: {
        username: 'username',
        fullname: 'fullname',
        email: 'email',
        phone: 'phone',
        password: 'password',
        created: 'created',
        modified: 'modified',
        avatarUrl: 'avatar_url',
        lastActive: 'last_active',
    },
    chat: {
        name: 'name',
        members: 'members',
        messages: 'messages',
        lastMessage: 'last_message',
        created: 'created',
        modified: 'modified',
    }
};
module.exports = SchemaFields;