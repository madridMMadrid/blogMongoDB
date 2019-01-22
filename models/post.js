const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const scheme = new Scheme({
    // схема принимающая от формы по name нужные нам параметры
    title: {
        type: String,
        require: true
    },
    body: {
        type: String
    }
},
{
    timestamps: true
    // для того что бы в базе по дефолту указывалось время создания и изменение коллекции
});

scheme.set('toJSON', {
    virtuals: true
    // это позволяет обращатся к id коллекции без _, как принято в mongodb
})

module.exports = mongoose.model('Post', scheme)