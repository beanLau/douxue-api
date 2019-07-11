var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: { type: String, required: true }, //题干
    isTop: { type: Boolean, default: false }, //是否置顶
    questionType: { type: Number, default: false }, //1单选2多选3主观题
    optiosn: { type: Array, default: [] }, //选项
    analysis: { type: String, default: '' },
    typeId: { type: String, default: '' }, //试题所属类型
    typeName: { type: String, default: '' }, //所属类型名称
    difficulty: { type: Number, default: 0 }, //难度1-100之间
    doCount: { type: Number, default: 0 }, //多少人已做
    accuracy: { type: Number, default: 0 }, //准确率
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

QuestionSchema.index({ name: 1 });

module.exports = mongoose.model('Question', QuestionSchema);