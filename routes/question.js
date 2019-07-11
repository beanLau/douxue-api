const router = require('koa-router')();
const Question = require('../models/question');
const utils = require('../utils');

/**
 * 新增或修改接口
 */
router.post('/addUpdateQuestion', async (ctx) => {
    let reqData = ctx.request.body;
    let question;
    if (reqData._id) { //如果传入id了为更新操作。
        question = await Question.findOneAndUpdate({ _id: reqData._id }, {
            title: reqData.title,
            questionType: reqData.questionType,
            optiosn: reqData.optiosn,
            typeId: reqData.typeId,
            typeName: reqData.typeName,
            analysis: reqData.analysis,
            difficulty: reqData.difficulty,
            updated_at: Date.now()
        })
    } else {
        question = await Question.create({
            title: reqData.title,
            questionType: reqData.questionType,
            optiosn: reqData.optiosn,
            typeId: reqData.typeId,
            typeName: reqData.typeName,
            analysis: reqData.analysis,
            difficulty: reqData.difficulty,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    ctx.body = {
        code: 0,
        data: question,
        msg: 'ok'
    }
})
/**
 * 删除标签
 */
router.post('/deleteQuestion', async (ctx) => {
    let question = await Question.deleteOne({ _id: ctx.request.body._id })
    ctx.body = {
        code: 0,
        data: question,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findQuestions', async (ctx) => {
    let reqData = ctx.request.body;
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    }, reqData)
    const reg = new RegExp(reqData.title, 'i');
    let _filter = {
        $and: [
            { title: { $regex: reg } },
            { typeId: reqData.typeId || '' }
        ]
    }
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let questions = await Question.find(_filter).limit(reqData.pageSize).sort({ 'isTop': 1, 'created_at': -1 }).skip(skip);
    count = await Question.count(_filter);
    ctx.body = {
        code: 0,
        data: {
            list: questions,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})

/**
 * 查询试题详情
 */
router.post('/findQuestionsByid', async (ctx) => {
    let reqData = ctx.request.body;
    let question = await Question.findOne({ _id: reqData._id });
    ctx.body = {
        code: 0,
        data: {
            question: question
        },
        msg: 'ok'
    }
})
module.exports = router