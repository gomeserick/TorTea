const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const dan = require('./requests/dan_me_uk')
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
            console.log("Mongo conectado");
        }).catch((erro) => {
            console.log("Erro ao conectar o Mongo" + erro)
        })
        mongoose.Promise = global.Promise;


require('./routes/nodes.js')(app)

app.listen(3000);