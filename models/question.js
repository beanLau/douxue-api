var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: { type: String, required: true }, //题干
    isTop: { type: Boolean, default: false }, //是否置顶 首页展示
    questionType: { type: Number, default: 3 }, //1单选2多选3主观题4判断
    options: { type: Array, default: [] }, //选项
    analysis: { type: String, default: '' },
    typeId: { type: String, default: '' }, //试题所属类型
    difficulty: { type: Number, default: 0 }, //难度1-100之间
    doCount: { type: Number, default: 0 }, //多少人已做
    rightCount: { type: Number, default: 0 }, //做对的数量
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

QuestionSchema.index({ name: 1 });

module.exports = mongoose.model('Question', QuestionSchema);