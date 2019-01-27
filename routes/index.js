const auth = require('./auth');
const post = require('./post');
const archive = require('./archive');
const comment = require('./comment');
// тут мы собираем нужные нам файлы из этой директории и передаем их в app.js, поскольку в папках все собирается в индексы
module.exports = {
  auth,
  post,
  archive,
  comment
};