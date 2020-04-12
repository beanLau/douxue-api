const router = require('koa-router')();
const Question = require('../models/question');
const utils = require('../utils');

/**
 * 获取置顶试题
 */
router.post('/xcxapi/findStickQuestions', async (ctx) => {
    let questions = await Question.find({isTop: true}).sort({ 'created_at': -1 }).lean();
    questions.map(item=>{
        item.created_at = utils.formatDbDate(item.created_at)
    })
    ctx.body = {
        code: 0,
        data: {
            list: questions
        },
        msg: 'ok'
    }
})

/**
 * 获取置顶试题
 */
router.post('/xcxapi/getQuestionDetail', async (ctx) => {
    let reqData = ctx.request.body;
    let questionDetail = await Question.findOne({ _id: reqData.id });
    // await Question.findOneAndUpdate({ _id: reqData.id }, {
    //     readCount: questionDetail.readCount + 1
    // })
    ctx.body = {
        code: 0,
        data: questionDetail,
        msg: 'ok'
    }
})

module.exports = router