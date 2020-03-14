const router = require('koa-router')();
const Article = require('../models/article');
const User = require('../models/user');
const jsonwebtoken = require("jsonwebtoken")
const wxapi = require("../apis/wxapi")

//登陆接口
router.post('/xcxapi/login', async (ctx) => {
    const { body } = ctx.request;
    let ctxDATA = JSON.stringify(ctx)
    let wxRes = await wxapi.getWxSessionKey(body)
    ctx.body = {
        code: 0,
        msg: '登录成功22',
        data: {
            openId: wxRes.openid,
            // 生成 token 返回给客户端
            token: jsonwebtoken.sign({
                data: wxRes,
                // 设置 token 过期时间
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 60 seconds * 60 minutes = 1 hour
            }, "douxue"),
        }
    }
    ctx.status = 200
    return;
})

//登陆接口
router.post('/xcxapi/getArticleList', async (ctx) => {
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
    if (reqData.tagId) {
        articles = await Article.find(_filter).where('tagId').equals(reqData.tagId).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    } else {
        articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    }
    if (reqData.tagId) {
        count = await Article.count(_filter).where('tagId').equals(reqData.tagId);
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
module.exports = router