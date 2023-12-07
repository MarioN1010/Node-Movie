
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
        });

        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectarse a MongoDB Atlas', error);
    }
};

module.exports = { connect };

