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

module.exports = router