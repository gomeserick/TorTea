const axios = require('axios');

const insert = require('../functions/insert')

const mongoose = require('mongoose');
require("../Schemas/nodeSchema")
const Nodes = mongoose.model("nodes")


function getFromDan() {
    console.log("Getting ips from https://www.dan.me.uk/torlist/")

    // Request the data from https://www.dan.me.uk/torlist/
    try {
        axios.get('https://www.dan.me.uk/torlist/').then(res => {

            const data = res.data.split("\n")
            data.forEach(element => {
                insert(element, Nodes)
            })
        }).catch(err => {
            console.log(err)
        })
    } catch (err) {
        console.log(err)
    }

}



module.exports = getFromDan();