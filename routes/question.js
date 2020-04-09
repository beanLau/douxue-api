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
            options: reqData.options,
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
            options: reqData.options,
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
        title: { $regex: reg },
        questionType: reqData.questionType
    }
    if(!reqData.questionType){
        delete _filter.questionType
    }
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let question;
    if (reqData.typeId) {
        question = await Question.find(_filter).where('typeId').equals(reqData.typeId).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip).lean();
    } else {
        question = await Question.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip).lean();
    }
    if (reqData.typeId) {
        count = await Question.count(_filter).where('typeId').equals(reqData.typeId);
    } else {
        count = await Question.count(_filter);
    }
    question.map(item=>{
        item.created_at = utils.formatDbDate(item.created_at)
    })
    ctx.body = {
        code: 0,
        data: {
            list: question,
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


/**
 * 推荐取消推荐
 * _id
 * isTop true false
 */
router.post('/recommendQuestion', async (ctx) => {
    let reqData = ctx.request.body;
    let article;
    question = await Question.findOneAndUpdate({ _id: reqData._id }, {
        isTop: reqData.isTop
    })
    ctx.body = {
        code: 0,
        data: question,
        msg: 'ok'
    }
})
module.exports = router