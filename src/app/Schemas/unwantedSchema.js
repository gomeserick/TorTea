const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unwanted = new Schema({
    ip: {
        type: String,
        required: true
    }
})

mongoose.model("unwanted", unwanted)