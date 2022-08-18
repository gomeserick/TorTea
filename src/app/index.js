const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const app = express();


//config
    //BodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    //HandleBars
    app.engine('handlebars', handlebars.engine({ 
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    }))
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, 'views'))

    //Mongoose
    mongoose.connect("mongodb://localhost/TeaBag").then(() =>{
            console.log("Mongo connected");
        }).catch((erro) => {
            console.log("Error trying to connect mongo: " + erro)
        })
        mongoose.Promise = global.Promise;


require('./routes/nodes.js')(app)

app.listen(3000);