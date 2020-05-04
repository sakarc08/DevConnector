const mongoose = require('mongoose');
const config = require('config');

const mongodbURI = config.get('mongodbURI');

const connectToDb = async () => {
    try {
        await mongoose.connect(mongodbURI, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('DB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectToDb