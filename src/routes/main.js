//Importing express
const express = require('express');
const router = express.Router();
//Redirects to /v1/nodes (real main page)
router.get('/', (req, res) => {
    res.redirect('v1/nodes')
})

module.exports = (app) => app.use('/', router)