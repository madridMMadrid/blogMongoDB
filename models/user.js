const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    login: {
      type: String,
      // это строка
      required: true,
      // она обязательна
      unique: true
      // она уникальна
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', schema);