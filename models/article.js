var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: { type: String, required: true },
    enable: { type: Boolean },
    typeId: { type: String },
    typeName: { type: String },
    tagId: { type: String },
    tagName: { type: String },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

ArticleSchema.index({ name: 1 });

module.exports = mongoose.model('Article', ArticleSchema);