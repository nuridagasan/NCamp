const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const appError = require('./utilities/ExpressError');
const asyncHandler = require('./utilities/asyncHandler');
const url = 'mongodb://localhost:27017/n-camp';
const Campsite = require('./models/campsite');
const morgan = require('morgan');

mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected.')
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.redirect('campsites');
})

app.get('/campsites', async (req, res) => {
    const campsites = await Campsite.find({});
    res.render('campsites/index', { campsites });

});

app.get('/campsites/new', (req, res) => {
    res.render('campsites/new');
});

app.post('/campsites', asyncHandler(async (req, res, next) => {
    const { title, description, location, image, price } = req.body.campsite;
    const campsite = new Campsite(
        { title, description, location, image, price });
    await campsite.save();
    res.redirect(`/campsites/${campsite._id}`);
}));

app.get('/campsites/:id', async (req, res) => {
    const { id } = req.params;
    const campsite = await Campsite.findById(id);
    res.render('campsites/show', { campsite });
});

app.get('/campsites/:id/edit', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campsite = await Campsite.findById(id);
    res.render('campsites/edit', { campsite });
}));

app.put('/campsites/:id', asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title, location, description, price, image } = req.body.campsite;
    await Campsite.findByIdAndUpdate({ _id: id }
        , { title, location, description, price, image });
    res.redirect(`/campsites/${id}`);
}));

app.delete('/campsites/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Campsite.findOneAndDelete({ _id: id });
    res.redirect('/campsites');
}));

app.use((err, req, res, next) => {
    throw new appError('hey',201);
    res.send(`PAGE: ${e.statusCode} ${e.message}`);
});

app.listen(3000, () => {
    console.log("PORT 3000, LISTENING!");
});