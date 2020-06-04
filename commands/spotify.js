const axios = require('axios');
const { token } = require('../config.json');
const fs = require('fs');
const data1 = require('../playlist/playlist-data-1.json');
const data2 = require('../playlist/playlist-data-2.json');
const data3 = require('../playlist/playlist-data-3.json');
const data4 = require('../playlist/playlist-data-4.json');
const data5 = require('../playlist/playlist-data-5.json');
const data6 = require('../playlist/playlist-data-6.json');

const songs1 = JSON.parse(JSON.stringify(data1));
const songs2 = JSON.parse(JSON.stringify(data2));
const songs3 = JSON.parse(JSON.stringify(data3));
const songs4 = JSON.parse(JSON.stringify(data4));
const songs5 = JSON.parse(JSON.stringify(data5));
const songs6 = JSON.parse(JSON.stringify(data6));


var playlist = [
    ...songs1.items,
    ...songs2.items,
    ...songs3.items,
    ...songs4.items,
    ...songs5.items,
    ...songs6.items,
];

var theWholeShebang = async function(channelId) {
    try {
        var result = await getCurrentMessages(channelId);
        var result2 = await getHistoricalMessages(channelId, result[0]);
        var test = [...result2, ...result];
        
        var songsByUsers = getSongsByUser(test);
        fs.appendFile('songs-by-user.json', JSON.stringify(songsByUsers), err => {
            if (err) throw err;
            console.log('saved!');
        })
    } catch (err) {
        
    }
}

var getCurrentMessages = async function (channelId) {
    try {
        var url = `http://discord.com/api/channels/${channelId}/messages?limit=100`;
        var response = await doMessageGet(url);
        return response;
    } catch (err) {
        console.log('FUCK THIS ERROR', err);
    }
}

var getHistoricalMessages = async function(channelId, startingMessage) {
    try {
        var holySnopesAList = [];
        var messageId = startingMessage.id;
        var date = startingMessage.timestamp;
        var url = `http://discord.com/api/channels/${channelId}/messages?limit=100&before=${messageId}`;

        for(;new Date(date) > new Date("2020-04-12T03:45:37.304000+00:00");) {
            url = `http://discord.com/api/channels/${channelId}/messages?limit=100&before=${messageId}`
            var blep = await doMessageGet(url);
            holySnopesAList = [...blep, ...holySnopesAList];
            messageId = blep[0].id;
            date = blep[0].timestamp;
        }
        return holySnopesAList;
    } catch (err) {
        console.log('WRITE BETTER CODE!', err);
    }
}

var getSongId = function(content) {
    var foo = [];
    content.split('/track/')
        .filter(x => x.includes('?si='))
        .forEach(element => {
            var bar = element.split('si=');
            foo = [...foo, ...bar]
        });

    var songIds = foo
        .filter(y => y.length === 23 && y.charAt(y.length - 1 === '?'))
        .map(z => z.substring(0, z.length - 1))
        .filter(a => playlist.find(b => b.track.id === a));
    return songIds;
} 

var getSongsByUser = function(data) {
    var users = data.reduce((acc, curr) => {
        if (curr.content.includes('https://open.spotify.com/track')) {
            const index = acc.findIndex(x => x.name === curr.author.username);
            if (index === -1) {
                acc.push({
                    name: curr.author.username,
                    songIds: getSongId(curr.content),
                    songs: [],
                });
                return acc;
            } else {
                var ids = getSongId(curr.content); 
                acc[index].songIds = [...acc[index].songIds, ...ids];
                return acc;
            };
        }
        return acc;
    }, []);
    users.forEach(user => {        
        user.songIds.forEach(id => {
            var song = playlist.find(song => song.track.id === id);
            if (song) user.songs.push(song);
        });
    });

    return users;
}

var doMessageGet = async function(url) {
    try {
        let result = [];
        await axios.get(url, { headers : { authorization: `Bot ${token}`}})
            .then(res => {
                var sorted = res.data.sort((a, b) => {
                    return new Date(a.timestamp) - new Date(b.timestamp);
                });
                result = sorted;
            })
            .catch(err => {
                // console.log('ERR', err);
            })
        return result;
    } catch (err) {
        console.log('SHIT! AN ERROR!')
    }
}

var getMessages = async function(url) {
    try {
        var result = await doMessageGet(url);
        return result;
    } catch (err) {
        // console.log('catch err', err);
    }
}



module.exports = {
    name: 'spotify',
    description: 'Get all Spotify links by user',
    execute(message, args) {
        // console.log('Channel', message.channel);
        theWholeShebang(message.channel.id);

    }
};