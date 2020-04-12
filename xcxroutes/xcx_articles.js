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

//小程序文章页面查询接口
	
router.post('/xcxapi/getArticleList', async (ctx) => {	
    let reqData = ctx.request.body;	
    reqData = Object.assign({	
        pageSize: 10,	
        pageIndex: 1	
    }, reqData)	
    const reg = new RegExp(reqData.title, 'i');	
    let _filter = {	
        title: { $regex: reg },	
        enable: true	
    }	
    let count = 0;	
    let skip = (reqData.pageIndex - 1) * reqData.pageSize	
    let articles;	
    if (reqData.tagId) {	
        if(reqData.tagId == -1){ //按照浏览排序	
            articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'readCount': -1 }).skip(skip).lean();	
        }else if(reqData.tagId == -2){ //按照点赞排序	
            articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'likeCount': -1 }).skip(skip).lean();	
        }else{	
            articles = await Article.find(_filter).where('tagId').equals(reqData.tagId).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip).lean();	
        }	
    } else {	
        articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip).lean();	
    }	
    if (reqData.tagId) {	
        count = await Article.count(_filter).where('tagId').equals(reqData.tagId);	
    } else {	
        count = await Article.count(_filter);	
    }	
    articles.map(item=>{	
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

module.exports = router