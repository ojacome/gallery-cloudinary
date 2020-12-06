const mongoose = require("mongoose");


const uri = process.env.MONGODB_URI ;
mongoose.connect( uri, {
    useNewUrlParser: true
})
.then( () => console.log('DB is connected'))
.catch( (err) => console.log(err))