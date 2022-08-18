const mongoose = require('mongoose')

const validate = require('./ValidateIpAdress')

/**
 * Create a document in MongoDB for an ip,
 * But only if the ip isn't already in the database
 * @param {*} element ip to save
 * @param {mongoose.Model} Model Model from collection to save
 */
function insert(element, Model) {
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
    if (!validate(element)) return;
    // Query Function
    Model.findOneAndUpdate(filter, update, options).catch(error =>
        console.log(error))

}


module.exports = insert;