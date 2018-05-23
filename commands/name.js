module.exports = {
    name: 'name',
    description: 'Generate a name for an NPC',
    execute(message, args) {
        message.channel.send(args);
    }
};