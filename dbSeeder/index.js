const mongoose = require('mongoose');
const data = require('./data')
const { descriptors, places } = require('./seedHelper')
const url = 'mongodb://localhost:27017/n-camp';
const Campsite = require('../models/campsite');

mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected.')
});

const random = (array) => array[Math.floor(Math.random() * array.length)];

const seedCampsiteDB = async () => {
    await Campsite.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const randi = Math.floor(Math.random() * 1000);
        const camp = new Campsite({
            title: `${random(descriptors)} ${random(places)}`,
            location: `${data[randi].city}, ${data[randi].state}`
        });
        await camp.save();
    }

};

seedCampsiteDB().then(() => {
    mongoose.connection.close();
});