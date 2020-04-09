//每日一练模型定义
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DailySchema = new Schema({
    questions: { type: Array, required: true }, //选项
    testCount: { type: Number, default: 0 }, //有多少人练习过
    created_at: { type: Date, default: Date.now } //创建时间
});

DailySchema.index({ created_at: -1 });

module.exports = mongoose.model('Daily', DailySchema);