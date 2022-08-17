const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const node = new Schema({
    ip: {
        type: String,
        required: true
    }
})

mongoose.model("nodes", node)