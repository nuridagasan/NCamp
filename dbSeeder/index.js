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
        const price = Math.floor(Math.random() * 30) +10
        const camp = new Campsite({
            title: `${random(descriptors)} ${random(places)}`,
            location: `${data[randi].city}, ${data[randi].state}`,
            image: 'https://source.unsplash.com/collection/429524',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores error reiciendis laudantium quibusdam placeat eos repellat praesentium minima non, ullam, architecto hic quos suscipit, labore illum nulla delectus quae. Voluptate? Ab optio a sint velit deleniti recusandae atque explicabo impedit adipisci tenetur in eum, repellat ad placeat harum, delectus dolor non architecto eos fugit! Repellat sequi dolor amet magni consequatur.',
            price
        });
        await camp.save();
    }

};

seedCampsiteDB().then(() => {
    console.log('Connection Closed.')
    mongoose.connection.close();
});