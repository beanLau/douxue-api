var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  content: { type: String, required: true }, //评论内容
  articleId: { type: String, required: true }, //文章id
  avatarUrl: { type: String, required: true }, //评论头像
  nickName: { type: String, required: true }, //评论人昵称
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);