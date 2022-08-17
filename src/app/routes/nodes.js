const express = require('express');
const axios = require('axios');
const torProject = require('../requests/torproject')
const dan = require('../requests/dan_me_uk')
const validate = require('../functions/ValidadeIpAdress')

const mongoose = require('mongoose');

require("../Schemas/nodeSchema")
require("../Schemas/unwantedSchema")
const Nodes = mongoose.model("nodes")
const Unwanted = mongoose.model("unwanted")

const router = express.Router();



// Task #1, Endpoint GET
router.get('/Allips', (req, res) => {
    data = requester();
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
        // Filters based on ip
        const filter = { ip: req.body.ip };

        // New variable for code reading propourses, but it is redundant and unnecessary
        // Carries the part of the document that will be updated
        const update = { ip: req.body.ip }

        // Query options, in this case sets to create a new document if none is found
        const options = {
            upsert: true
        };
        Unwanted.findOneAndUpdate(filter, update, options).then(() => {
            res.redirect("/v1/nodes/")
        }).catch(error =>
            console.log(error))
    }).catch(error =>{
        console.log(error)
    })
})

router.get('/ips', (req, res) => {
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
                    if(x.ip === node.ip){
                        var letIn = false;
                    }
                })
                if(letIn){
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
    setInterval(async() => {
        console.log("Requesting IPS")
        const torArray = await torProject();

    }, 1800000)

}

module.exports = (app) => app.use('/v1/nodes', router)