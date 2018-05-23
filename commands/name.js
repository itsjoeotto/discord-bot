const { names } = require('../names.json');

function generateRandomName () {
    let beginning = nameChart.beginning[getBeginning()];
    let middle = nameChart.middle[getMiddle()];
    let end = nameChart.end[getEnd()];
    let name = ((beginning) ? beginning : '') + middle + ((end) ? end : '');
    return capitalizeName(name);
}

function getBeginning () {
    let roll = diceRoll(1, 20);
    if (roll <= 4) {
        return;
    } else {
        return roll - 1;
    }
}

function getMiddle () {
    let roll = diceRoll(1, 20);
    return roll - 1;
}

function getEnd () {
    let roll = diceRoll(1, 20);
    if (roll === 1) {
        return;
    } else {
        return roll - 1;
    }
}

function capitalizeName (name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function diceRoll (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'name',
    description: 'Generate a name for an NPC',
    execute(message, args) {
        if (!args[0]) {
            return message.reply('Please specify race and gender!');
        } else {
            message.channel.send(args);
        }
    }
};