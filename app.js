const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
    // body-parser извлекает всю часть тела входящего потока запросов и предоставляет его на req.body
    // таким образом мы можем достовать из html атрибута name то что нам необходимо
app.use(staticAsset(path.join(__dirname, 'public')));
    // плагин для рандомной подстановки хеша к css, для пробития

app.use(express.static(path.join(__dirname, 'public')));
    // указываем express статичный файл который нужно выдавать пользователю а именно папку public
app.use(
    '/script', // указываем конкретно что отдать
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
        // указываем конкретный путь, в данном случае к jquery
); 


app.get('/', (req, res) => {
        res.render('index');
});



module.exports = app;