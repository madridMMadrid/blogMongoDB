const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');
const tr = require('transliter');

const scheme = new Schema({
    // схема принимающая от формы по name нужные нам параметры
    title: {
        type: String,
        require: true
    },
    body: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentCount: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
    // для того что бы в базе по дефолту указывалось время создания и изменение коллекции
});


scheme.statics = {
    incCommentCount(postId) {
        return this.findByIdAndUpdate(
            postId, 
            { $inc: {commentCount: 1} },
            { new: true }
        )
    }
}

scheme.plugin(
  URLSlugs('title', {
    field: 'url',
    generator: text => tr.slugify(text)
  })
);
scheme.set('toJSON', {
    virtuals: true
    // это позволяет обращатся к id коллекции без _, как принято в mongodb
})

module.exports = mongoose.model('Post', scheme)