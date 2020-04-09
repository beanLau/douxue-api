const router = require('koa-router')()
const Daily = require('../models/dailyPractice')
const Question = require('../models/question');
const utils = require('../utils')
var moment = require('moment')

/**
 * 查询当日的练习题
 */
router.post('/xcxapi/getTodayQuesstions', async (ctx) => {
    let dateNow = Date.now()
    let begin = new Date(moment().format("YYYY-MM-DD"))
    let end = new Date(begin.getTime() + 86400000)
    let daily = await Daily.findOne({ created_at: {
        '$gte': begin, //大于等于
        '$lt':  end//小于
    } }).lean();
    //如果还没有今日的题，随机出来新增
    if (!daily) {
        let questions = await Question.aggregate( [ { $sample: { size: 3 } } ] );
        questions = JSON.parse(JSON.stringify(questions))
        let questionArr = []
        questions.forEach(item => {
            questionArr.push(item._id)
        });
        daily = await Daily.create({
            questions: questionArr,
            created_at: dateNow
        })
        daily = daily.toObject()
        daily.created_at = moment(daily.created_at).format("YYYY-MM-DD")
        daily.questionList = questions
    } else { //如果已经有了，根据questionids查询所有试题，拼接参数返回。
        let questions = await Question.find({_id: daily.questions}).lean();
        daily.questionList = questions
        daily.created_at = moment(daily.created_at).format("YYYY-MM-DD")
    }
    delete daily.questions
    ctx.body = {
        code: 0,
        data: daily,
        msg: 'ok'
    }
})
module.exports = router