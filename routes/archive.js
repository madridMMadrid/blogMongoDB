const express = require('express');
const router = express.Router();

const config = require('../config');
const models = require('../models');

function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  models.Post.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then(posts => {
      models.Post.count()
        .then(count => {
          res.render('index', {
            posts,
            current: page,
            pages: Math.ceil(count / perPage),
            user: {
              id: userId,
              login: userLogin
            }
          });
        })
        .catch(console.log);
    })
    .catch(console.log);
}

// routers
// из app.js мы приходим сюда и при вызове главной страницы вызываем функцию posts которая генерирует нам контент
router.get('/', (req, res) => posts(req, res));
// при переходе на href="/archive/<%= Number(current) - 1 %>" у нас будет вызыватся тажа функция с нужным нам контентом
router.get('/archive/:page', (req, res) => posts(req, res));

module.exports = router;