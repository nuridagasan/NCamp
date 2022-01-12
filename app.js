const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/n-camp';
const Campsite = require('./models/campsite');

mongoose.connect(url);

const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('Database Connected.')
});

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'))

app.get('/',(req,res) => {
    res.render('index');
})

app.get('/makecampsite', async(req,res) => {
    const camp = new Campsite({title:'Bosphorus', price:'249', description:'Beautiful see view', location:'Istanbul'});
    await camp.save();
    res.send(camp);
})


app.listen(3000,()=> {
    console.log("PORT 3000, LISTENING!");
})