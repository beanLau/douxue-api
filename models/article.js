var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: { type: String, required: true },
    enable: { type: Boolean, default: false },
    typeId: { type: String, required: true },
    typeName: { type: String, default:"" },
    url: { type: String, required: true },
    tagId: { type: String, default:""},
    tagName: { type: String, default:""},
    readCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

ArticleSchema.index({ name: 1 });

module.exports = mongoose.model('Article', ArticleSchema);