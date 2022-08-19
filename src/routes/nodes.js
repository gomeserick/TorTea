const express = require('express');
const axios = require('axios');


const mongoose = require('mongoose');
require("../Schemas/unwantedSchema")
const Unwanted = mongoose.model("unwanted")

const insert = require('../functions/insert');


const router = express.Router();

//Indicates the last time the requester function was used, explanation on getFromDan function
var time = +new Date();
//Variable that stores every IP Address
var ipList = []

//Loads the data for the first time
var data = requester();

// Task #1, Endpoint GET
router.get('/allips', async(req, res) => {
    var currentTime = +new Date();
    if ((currentTime - time) > 1860000) //31 minutes cooldown in milliseconds
        data = await requester();
    
    res.status(200).send({ nodes: ipList })
})

//Main route
router.get('/', (req, res) => {
    res.render("nodes")
})


// Task #2 endpoint POST
router.post('/remove', (req, res) => {
    // Inserts unwanted data on mongodb
    if (insert(req.body.ip, Unwanted)) {
        req.flash("success_msg", "The IP will not appear on IP list anymore")
        res.redirect('/v1/nodes')
    } else {
        req.flash("error_msg", "You entered an invalid IP")
        res.redirect('/v1/nodes')
    }
})

//Task #3 enpoint GET
router.get('/ips', async(req, res) => {
    // Do not allows requets made in less than 31 minutes
    var currentTime = +new Date();
    if ((currentTime - time) > 1860000) //31 minutes cooldown in milliseconds
        data = await requester();
    
    //Create temp variable
    var ips = ipList;
    // Gets Unwanted IPs from database
    await Unwanted.find().then(unwanted => {
        //Iterate through every IP and remove the ones also presents in the database
        for (var i = 0; i < ips.length; i++) {
            var ip = ips[i]
            unwanted.forEach(node => {
                if (node.ip === ip.ip) {
                    ips.splice(i, 1)
                    i--;
                }

            })
        }
    })
    res.status(200).send({ nodes: ips })
})

// Call the functions that gets the IPs
async function requester() {
    console.log("Requesting IPS")
    const a = await getFromTorProject();
    const b = await getFromDan();
    //Resets time
    time = +new Date();
}
/**
 * Gets data from dan.me.uk/torlist
 * This site only allows requests every 30 minutes, and too much requests will permanently
 * ban you from getting IPs there, so remember yourself to comment the url in
 * the axios.get() function and use only torproject api when debugging
 * Reason for the 31 minutes cooldown (1+ minute for safety measures)
 */
async function getFromDan() {
    console.log("Getting IPs from https://www.dan.me.uk/torlist/")

    // Request the data from https://www.dan.me.uk/torlist/
    try{await axios.get( 'https://www.dan.me.uk/torlist/' ).then(res => {
        //dan.me.uk doesn't give information in json, so this is necessary
        const data = res.data.split("\n")
        //Checks if each element is alredy present in the ipList and push it in if not
        data.forEach(element => {
            redundancyChecker(element)
        })
    }).catch(err => {
        console.log(err)
    })
    } catch (err) {
        console.log(err)
    } 


}
/**
 * Request IPs from torProject
 */
async function getFromTorProject() {
    console.log("Getting IPs from https://onionoo.torproject.org/summary?limit=5000")

    //Request data from https://onionoo.torproject.org/summary?limit=5000
    await axios.get('https://onionoo.torproject.org/summary?limit=5000').then(res => {
        data = {
            relay: res.data.relays,
        }
        // Loop through every object
        data.relay.forEach(element => {
            //In Tor Project many Ipv4 are followed by Ipv6, this code loop through these 2 and separate them
            element.a.forEach(async element => {
                //The Ipv6 from torProject are in between square brackets, this code removes them
                var string = await element.toString();
                var converted = await replacer(string)
                //Checks if code isn't already present in the ipList
                redundancyChecker(converted)
            })
        })
    }).catch(err => {
        console.log("An error has occourred: " + err)
    })
}
/**
 * Removes square brackets
 * @param {String} element String with square brackets
 * @returns String without square brackets
 */
function replacer(element) {
    return element.replace(/[\])}[{(]/g, '');
}
/**
 * Checks is the IP is already on the list and, if not, add them to it
 * @param {*} element IP to add
 */
function redundancyChecker(element) {
    //This variable stay true while the loop don't find any equal IP
    var letIn = true;
    ipList.forEach((ip, i) => {
        if (element === ip) letIn = false
    })
    if (letIn) ipList.push({
        ip: element
    })
}


module.exports = (app) => app.use('/v1/nodes', router)