const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Post = require('./models/post');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
    // body-parser извлекает всю часть тела входящего потока запросов и предоставляет его на req.body
    // таким образом мы можем достовать из html атрибута name то что нам необходимо
app.use(express.static(path.join(__dirname, 'public')));
    // указываем express статичный файл который нужно выдавать пользователю а именно папку public
app.use(
    '/script', // указываем конкретно что отдать
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
        // указываем конкретный путь, в данном случае к jquery
); 

const arr = [
    'hello',
    'world',
    'test'
];

app.get('/', (req, res) => {
    Post.find({}).then(posts => {
        // обращаемся к базе данных по сущьности и находим в ней весь обьект
        res.render('index', {posts: posts});
            // рендерим в index то что находится в сущьности
    })
});


// res.render('index', {arr: arr}));

app.get('/create', (req, res) => res.render('create'));
app.post('/create', (req, res) => {
    const {title, body} = req.body;
    // arr.push(req.body.text);
    Post.create({
        title: title,
        body: body
    }).then(post => console.log(post.id))

    res.redirect('/');
});

module.exports = app;