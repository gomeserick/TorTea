const axios = require('axios');

const insert = require('../functions/insert')

const mongoose = require('mongoose')
require("../Schemas/nodeSchema")
const Nodes = mongoose.model("nodes")
// Requests the data from tor api
function requestTorProject() {
    console.log("Getting ips from https://onionoo.torproject.org/summary?limit=5000")
    axios.get('https://onionoo.torproject.org/summary?limit=60').then(res => {
        data = {
            relay: res.data.relays,
        }
        data.relay.forEach(element => {
            element.a.forEach(async element => {
                var string = await element.toString();
                var converted = await replacer(string)
                insert(converted, Nodes);
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