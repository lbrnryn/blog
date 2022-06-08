const express = require('express');
const { engine } = require('express-handlebars');
require('dotenv').config();
require('./db.js');
const Tutorial = require('./models/tutorial');
const methodOverride = require('method-override');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const app = express();

app.engine('.hbs', engine({
  extname: '.hbs',
  runtimeOptions: { allowProtoPropertiesByDefault: true }
}));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  try {
    const tutorials = await Tutorial.find({});
    tutorials.forEach((tutorial) => {
      tutorial.isDevelopment = process.env.NODE_ENV == 'development' ? true: false;
      tutorial.url = process.env.NODE_ENV == 'development' ? "http://localhost:3000/api/tutorial": "http://localhost:3000/api/tutorial";
    })

    const isDevelopment = process.env.NODE_ENV == 'development' ? true: false;
    // console.log(process.env.MONGO_URI)
    res.render('tutorials', { tutorials, isDevelopment })
    // res.render('tutorials')
  } catch (err) { console.log(err.message) }
});

app.post('/', async (req, res) => {
  try {
    // console.log(req.body);
    const { title, description, lesson } = req.body;
    await Tutorial.create({ title, description, lesson });
    res.redirect('/');
  } catch (err) { console.log(err.message) }
});

app.get('/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findById({ _id: req.params.id });
    // console.log(tutorial)
    res.render('tutorial', { tutorial });
  } catch (err) { console.log(err.message) }
});

app.put('/:id', async (req, res) => {
  try {
    const { title, description, lesson } = req.body;
    // await Tutorial.findByIdAndUpdate({ _id: req.params.id }, {
    await Tutorial.findByIdAndUpdate({ _id: req.params.id }, {
      title, description, lesson, markedHtml: dompurify.sanitize(marked.parse(lesson))
    })
    res.redirect('/');
    // console.log(req.body)
  } catch (err) { console.log(err.message) }
})

app.get('/api/tutorial/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findById({ _id: req.params.id });
    res.json(tutorial);
  } catch (err) { console.log(err.message) }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
