const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
// модуль для шифрования

const models = require('../models');

// POST is authorized
router.post('/register', (req, res) => {
    // res.json({
    //     ok: true
    // }) так мы можем отдать в браузер то что мы получили при запросе к форме
    const login = req.body.login;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (!login || !password || !passwordConfirm) {

        const fields = [];
        if (!login) fields.push('login');
        if (!password) fields.push('password');
        if (!passwordConfirm) fields.push('passwordConfirm');

        res.json({
          ok: false,
          error: 'Все поля должны быть заполнены!',
          fields
        });
      } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
        res.json({
          ok: false,
          error: 'Только латинские буквы и цифры!',
          fields: ['login']
        });
      } else if (login.length < 3 || login.length > 16) {
        res.json({
          ok: false,
          error: 'Длина логина от 3 до 16 символов!',
          fields: ['login']
        });
      } else if (password !== passwordConfirm) {
        res.json({
          ok: false,
          error: 'Пароли не совпадают!',
          fields: ['password', 'passwordConfirm']
        });
      } else {

        models.User.findOne({
            login
          }).then(user => {
            if (!user) {
              bcrypt.hash(password, null, null, (err, hash) => {
                models.User.create({
                  login,
                  password: hash
                })
                  .then(user => {
                    console.log(user);
                    res.json({
                      ok: true
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    res.json({
                      ok: false,
                      error: 'Ошибка, попробуйте позже!'
                    });
                  });
              });
            } else {
              res.json({
                ok: false,
                error: 'Имя занято!',
                fields: ['login']
              });
            }
          });
      }
});

module.exports = router;