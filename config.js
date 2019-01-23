const dotenv = require('dotenv'); // для определения дефотных переменных окружения
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL,
    IS_PRODUCTION: process.env.NODE_ENV === 'production'
};


// тут мы создаем модуль с нужными нам дефолтными параметрами, переменные