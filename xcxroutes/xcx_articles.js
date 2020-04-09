const router = require('koa-router')()
const Article = require('../models/article')
const utils = require('../utils')

/**
 * 通过专题获取文章列表
 */
router.post('/xcxapi/getArticleListBySpecial', async (ctx) => {
    let reqData = ctx.request.body;
    if(!reqData.specialId){
        ctx.body = {
            code: 0,
            data: {
                list: [],
                pageSize: reqData.pageSize,
                pageIndex: reqData.pageIndex,
                total: 0
            },
            msg: 'ok'
        }
        return
    }
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    }, reqData)
    let _filter = {"specialId": reqData.specialId, enable: true}
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let articles;
    articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'readCount': -1 }).skip(skip).lean();
    if (reqData.specialId) {
        count = await Article.count(_filter);
    } else {
        count = await Article.count(_filter);
    }
    articles.forEach(item=>{
        item.created_at = utils.formatDbDate(item.created_at)
    })
    ctx.body = {
        code: 0,
        data: {
            list: articles,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})

/**
 * 查询详情
 */
router.post('/findArticleById', async (ctx) => {
    let reqData = ctx.request.body;
    let articleDetail = await Article.findOne({ _id: reqData.id });
    await Article.findOneAndUpdate({ _id: reqData.id }, {
        readCount: articleDetail.readCount
    })
    ctx.body = {
        code: 0,
        data: {
            articleDetail: articleDetail
        },
        msg: 'ok'
    }
})


module.exports = router