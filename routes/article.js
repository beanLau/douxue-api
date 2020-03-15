const router = require('koa-router')();
const Article = require('../models/article');
const Type = require('../models/type');
const Tag = require('../models/tag');
const Special = require('../models/special');

/**
 * 新增或修改接口
 */
router.post('/addUpdateArticle', async (ctx) => {
    let reqData = ctx.request.body;
    let article, type, tag, special;
    type = await Type.findById(reqData.typeId)
    type = type || {}
    tag = await Tag.findById(reqData.tagId)
    tag = tag || {}
    special = await Special.findById(reqData.specialId)
    special = special || {}
    if (reqData._id) { //如果传入id了为更新操作。
        article = await Article.findOneAndUpdate({ _id: reqData._id }, {
            title: reqData.title,
            enable: false,
            url: reqData.url,
            typeId: reqData.typeId || "",
            typeName: type.name || "",
            tagId: reqData.tagId || "",
            tagName: tag.name || "",
            specialId: reqData.specialId || "",
            specialName: special.name || "",
            content: reqData.content,
            updated_at: Date.now()
        })
    } else {
        article = await Article.create({
            title: reqData.title,
            enable: false,
            typeId: reqData.typeId,
            url: reqData.url,
            typeName: type.name,
            tagId: reqData.tagId || "",
            tagName: tag.name || "",
            specialId: reqData.specialId || "",
            specialName: special.name || "",
            content: reqData.content,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    ctx.body = {
        code: 0,
        data: article,
        msg: 'ok'
    }
})
/**
 * 删除标签
 */
router.post('/deleteArticle', async (ctx) => {
    let article = await Article.deleteOne({ _id: ctx.request.body._id })
    ctx.body = {
        code: 0,
        data: article,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findArticles', async (ctx) => {
    let reqData = ctx.request.body;
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    }, reqData)
    const reg = new RegExp(reqData.title, 'i');
    let _filter = {
        title: { $regex: reg }
    }
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let articles;
    if (reqData.typeId) {
        articles = await Article.find(_filter).where('typeId').equals(reqData.typeId).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    } else {
        articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    }
    if (reqData.typeId) {
        count = await Article.count(_filter).where('typeId').equals(reqData.typeId);
    } else {
        count = await Article.count(_filter);
    }
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
 * 启用禁用接口
 * _id
 * status 1启用 0 禁用
 */
router.post('/enableArticle', async (ctx) => {
    let reqData = ctx.request.body;
    let article;
    article = await Article.findOneAndUpdate({ _id: reqData._id }, {
        enable: reqData.enable
    })
    ctx.body = {
        code: 0,
        data: article,
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
        readCount: articleDetail.readCount + 1
    })
    ctx.body = {
        code: 0,
        data: {
            articleDetail: articleDetail
        },
        msg: 'ok'
    }
})

/**
 * 点赞功能
 */
router.post('/addLikeCount', async (ctx) => {
    let reqData = ctx.request.body;
    let articleDetail = await Article.findOne({ _id: reqData.articleId });
    await Article.findOneAndUpdate({ _id: reqData.articleId }, {
        likeCount: (articleDetail.likeCount || 0) + 1
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