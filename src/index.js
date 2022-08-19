//Importing modules
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session')

//Port to be listen to
const port = process.env.PORT || 8080;
api_key = process.env.KEY || "debugging"

console.log(`Listening on localhost:${port}`)

const app = express();



//config

    // Session
    app.use(session({
        secret: api_key,
        resave:true,
        saveUninitialized: true
    }))

    //  Middleware
    app.use(flash())
    app.use((req,res,next)=> {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
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

//Import routes
require('./routes/nodes.js')(app)
require('./routes/main.js')(app)

app.listen(port);