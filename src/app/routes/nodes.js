const express = require('express');
const torProject = require('../requests/torproject')
const dan = require('../requests/dan_me_uk')
const validate = require('../functions/ValidateIpAdress')

const mongoose = require('mongoose');
const insert = require('../functions/insert');
const getFromDan = require('../requests/dan_me_uk');

require("../Schemas/nodeSchema")
require("../Schemas/unwantedSchema")
const Nodes = mongoose.model("nodes")
const Unwanted = mongoose.model("unwanted")

const router = express.Router();

var time = +new Date();

// Task #1, Endpoint GET
router.get('/Allips', (req, res) => {
    var currentTime = +new Date();
    if((currentTime - time) > 1860000){
        data = requester();
        time = currentTime;
    } else {
        console.log("You need to wait 30minutes")
    }
    Nodes.find().then(nodes => {

        nodes.forEach(async(node, i) => {
            if (node.ip === null) {
                nodes[i].remove();
            }
        })

        res.render("ips", { nodes: nodes })
    })
})

router.get('/', (req, res) => {
    res.render("nodes")
})



router.post('/remove', (req, res) => {
    Nodes.find({ ip: req.body.ip }).then(ip => {
        insert(req.body.ip, Unwanted)
    }).catch(error => {
        console.log(error)
    })
})

router.get('/ips', (req, res) => {
    var currentTime = +new Date();
    if((currentTime - time) > 1860000){
        data = requester();
        time = currentTime;
    } else {
        console.log("You need to wait 30minutes")
    }

    // Find every IP address
    Nodes.find().then(nodes => {
        var ips = []
            // Iterate through every IP
        nodes.forEach((node, i) => {
            // Find every Unwanted IP address
            Unwanted.find().then(unwanted => {
                var letIn = true;

                //Iterate through every IP from unwanted
                unwanted.forEach((x, j) => {
                    // If some ip is present in both, the ip is removed from wanted ips
                    if (x.ip === node.ip) {
                        nodes[i].remove();
                    }
                })
                if (letIn) {
                    ips.push(nodes[i].ip);
                }
            })
            if (node.ip === null) {
                nodes[i].remove();
            }
        })

        res.render("ips", { nodes: ips })
    })
})

async function requester() {
    console.log("Requesting IPS")
    const a = await torProject;
    const b = await getFromDan;


}

module.exports = (app) => app.use('/v1/nodes', router)