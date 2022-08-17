const axios = require('axios');


/*async function getFromDan() {
        axios.get(/*'https://www.dan.me.uk/torlist/').then(res => {
            const data = res.data.split(" ")
            data.forEach(element => {
                const filter = { ip: element };
                // New variable for reading propourse, but it is unnecessary
                const update = { ip: element }
                const options = {
                    upsert: true
                };
                try {
                    Node.findOneAndUpdate(filter, update, options, ).then((err, data) => {
                        
                    }).catch(error => console.log(error))
                } catch (error) {
                    console.log(error)
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }



module.exports = getFromDan();*/