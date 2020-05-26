const axios = require('axios');
const { token } = require('../config.json');
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
        messageId = '';
        var url = `http://discord.com/api/channels/${channelId}/messages?limit=100`;
        var list = [];
        // var now = new Date().getMonth;
        var result = await getMessages(url);
        list = [...result];
        messageId = list[0].id;
        var beforeUrl = `http://discord.com/api/channels/${channelId}/messages?limit=100&before=${list[0].id}`
        var result2 = await getMessages(beforeUrl);
        var test = [...result2, ...list];
        // console.log('RESULT 1', result.filter(b => b.content.includes('https://open.spotify.com/track')).map(c => c.id));
        // console.log('RESULT 2', result2.filter(b => b.content.includes('https://open.spotify.com/track')).map(c => c.id));
        var dates = list.map(x => x.timestamp);
        console.log(test.length);
        var songsByUsers = getSongsByUser(test);
        console.log('songsByUSers', songsByUsers);
    } catch (err) {
        
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
    const users = data.reduce((acc, curr) => {
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

    var blep;
}

var doMessageGet = async function(url) {
    try {
        await axios.get(url, { headers : { authorization: `Bot ${token}`}})
            .then(res => {
                // getSongsByUser(res.data);
                // var dates = res.data.map(x => x.timestamp);
                // console.log("DATES", dates.sort());
                // var oldest = res.data.find(y => y.timestamp === dates[0]);
                // console.log('OLDEST', oldest);
                // console.log(res.data.length);
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