const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const config = require('./config');

// database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`)
  });
mongoose.connect(config.MONGO_URL, { useMongoClient: true });

// express
const app = express();


// sets and users
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

// routers
app.get('/', (req, res) => {
        res.render('index');
});

// catch 404 and forward to error handler
// если страница не найдена
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  
// error handler
// если вообще полный пихдец с сервером
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {},
  });
});
  



app.listen(config.PORT, () => console.log(`Example app listening on port ${config.PORT}`));