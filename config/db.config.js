// import mongoose package
const mongoose = require('mongoose')

// declare a Database string URI
const DB_URI='mongodb+srv://shulingcheng:test1234@dcardhw.w3xyu.mongodb.net/dcard-hw?retryWrites=true&w=majority'

// establishing a database connection
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 1000,
})

const connection = mongoose.connection

// export the connection object
module.exports = connection