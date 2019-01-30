// файл для генерасии контента а именно постов

const faker = require('faker');
const tr = require('transliter');

const models = require('./models');

const owner = '5c4b023ef5091e5154c3b009';

module.exports = async () => {
  try {
    await models.Post.remove();

    Array.from({ length: 20 }).forEach(async () => {
      const title = faker.lorem.words(5);
      const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;
      const post = await models.Post.create({
        title,
        body: faker.lorem.words(100),
        url,
        owner
      });
      console.log(post);
    });
  } catch (error) {
    console.log(error);
  }
};