const mongoose = require('mongoose');

const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
