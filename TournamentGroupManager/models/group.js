module.exports = {
    identity: 'group',
    connection: 'default',
    attributes: {
        id: {
            type: 'integer',
            defaultsTo: 0,
            required: true,
        },
        name: {
            type: 'string',
            required: true,
        },
        firstMemberName: {
            type: 'string',
            required: true,
        },
        secondMemberName: {
            type: 'string',
            required: true,
        },
        
        user: {
            model: 'user',
        },
    }
}