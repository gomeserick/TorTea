const mongoose = require('mongoose')

require("../Schemas/nodeSchema");
const Node = mongoose.model("nodes");


/**
 * Create a document in MongoDB for every given ip,
 * But only if the ip isn't already in the database
 * @param {*} element ip to save
 */
function insert(element){
    // Filters based on ip
    const filter = { ip: element };

    // New variable for code reading propourses, but it is redundant and unnecessary
    // Carries the part of the document that will be updated
    const update = { ip: element }

    // Query options, in this case sets to create a new document if none is found
    const options = {
        upsert: true
    };
    //checks if the element is null
    if(element == null) return;
        // Query Function
        Node.findOneAndUpdate(filter, update, options).catch(error => 
            console.log(error))
}


module.exports = insert;
