var mongoose = require('mongoose');

var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

var Schema = mongoose.Schema;

var Comment = require('./comment');

var articleSchema = new Schema(
  {
    title: String,
    description: String,
    tags: [String],
    author: String,
    likes: { type: Number, default: 0 },
    slug: { type: String, slug: "title" },
    commentId: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);


var Article = mongoose.model('Article', articleSchema);
module.exports = Article;