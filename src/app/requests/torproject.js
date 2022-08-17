const axios = require('axios');

const insert = require('../functions/insert')

// Requests the data from tor api
function requestTorProject() {
    axios.get('https://onionoo.torproject.org/summary?limit=60').then(res => {
        data = {
            relay: res.data.relays,
        }
        data.relay.forEach(element => {
            element.a.forEach(async element => {
                var string = await element.toString();
                var converted = await replacer(string)
                insert(converted);
            })
        })
        return data;
    }).catch(err => {
        console.log("An error has occourred" + err)
    })
}

function replacer(element){
    return element.replace(/[\])}[{(]/g,'');
}

module.exports = requestTorProject();