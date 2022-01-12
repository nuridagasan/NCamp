const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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
app.set('views',path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

app.get('/',(req,res) => {
    res.render('index');
})

app.get('/campsites', async (req,res) => {
    const campsites = await Campsite.find({});
    res.render('campsites/index',{campsites});

});

app.get('/campsites/new', (req,res) => {
    res.render('campsites/new');
});

app.post('/campsites', async (req,res) => {
    const {title, description, location} = req.body.campsite;
    const campsite = new Campsite(
        {title:title,description:description,location:location});
    await campsite.save();
    res.redirect('campsites');
});

app.get('/campsites/:id', async (req,res) => {
    const {id} = req.params;
    const campsite = await Campsite.findById(id);
    res.render('campsites/show',{campsite});
});

app.get('/campsites/:id/edit', async (req,res) => {
    const {id} = req.params;
    const campsite = await Campsite.findById(id);
    res.render('campsites/edit',{campsite});
});

app.put('/campsites/:id',async(req,res) => {
    const {id} = req.params;
    const {title,location,description} = req.body.campsite;
    await Campsite.findByIdAndUpdate({_id:id}
        ,{title:title,location:location,description:description});
    res.redirect(`/campsites/${id}`);
})

app.delete('/campsites/:id',async(req,res)=> {
    const {id} = req.params;
    await Campsite.findOneAndDelete({_id:id});
    res.redirect('/campsites');
})

app.listen(3000,()=> {
    console.log("PORT 3000, LISTENING!");
})