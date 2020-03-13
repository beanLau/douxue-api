var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
    title: { type: String, required: true }, //标题
    enable: { type: Boolean, default: false }, //是否启用
    typeId: { type: String, default: "" }, //所属类型id
    typeName: { type: String, default:"" }, //所属类型名称
    url: { type: String, required: true }, //图片url
    tagId: { type: String, default:""}, //标签id
    tagName: { type: String, default:""}, //标签name
    specialId: { type: String, default:""}, //专题id
    specialName: { type: String, default:""}, //专题name
    readCount: { type: Number, default: 0 }, //阅读数量
    likeCount: { type: Number, default: 0 }, //收藏数量
    content: { type: String, required: true }, //内容
    created_at: { type: Date, default: Date.now }, //创建时间
    updated_at: { type: Date, default: Date.now } //更新时间
});

ArticleSchema.index({ name: 1 });

module.exports = mongoose.model('Article', ArticleSchema);