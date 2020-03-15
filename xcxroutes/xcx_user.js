const router = require('koa-router')()
const Article = require('../models/article')
const User = require('../models/user')
const jsonwebtoken = require("jsonwebtoken")
const wxapi = require("../apis/wxapi")
const utils = require('../utils')

//登陆接口
router.post('/xcxapi/login', async (ctx) => {
    const { body } = ctx.request;
    let ctxDATA = JSON.stringify(ctx)
    let wxRes = await wxapi.getWxSessionKey(body)
    let userDetail = await User.findOne({ openId: wxRes.openid })
    if(userDetail){
        wxRes = Object.assign(wxRes,userDetail)
    }else{
        userDetail = {}
        await User.create({
            openId: wxRes.openid
        })
    }
    ctx.body = {
        code: 0,
        msg: '登录成功',
        data: {
            nickName: userDetail.nickName || "",
            avatarUrl: userDetail.avatarUrl || "",
            city: userDetail.city || "",
            country: userDetail.country || "",
            province: userDetail.province || "",
            gender: userDetail.gender || "",
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

/**
 * 修改用户信息接口
 */
router.post('/xcxapi/updateUserWxInfo', async (ctx) => {
    let reqData = ctx.request.body;
    let authorization = ctx.headers.authorization.split(" ")
    let token = "";
    let decoded = "";
    let user;
    if(authorization.length == 2){
        token = authorization[1]
    }else{
        ctx.body = {
            code: 401,
            data: null,
            msg: '没有权限'
        }
        return
    }
    decoded = jsonwebtoken.verify(token, 'douxue');
    if(decoded.data.openid){ //如果传入id了为更新操作。
        user = await User.findOneAndUpdate({openId: decoded.data.openid},reqData)
    }else{
        ctx.body = {
            code: -1,
            data: null,
            msg: '失败'
        }
        return
    }
    ctx.body = {
        code: 0,
        data: reqData,
        msg: 'ok'
    }
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
        if(reqData.tagId == -1){ //按照浏览排序
            articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'readCount': -1 }).skip(skip);
        }else if(reqData.tagId == -2){ //按照点赞排序
            articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'likeCount': -1 }).skip(skip);
        }else{
            articles = await Article.find(_filter).where('tagId').equals(reqData.tagId).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
        }
    } else {
        articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    }
    if (reqData.tagId) {
        count = await Article.count(_filter).where('tagId').equals(reqData.tagId);
    } else {
        count = await Article.count(_filter);
    }
    articles.forEach(item=>{
        item.createdTime = utils.formatDbDate(item.created_at)
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
    let _filter = {"specialId": reqData.specialId}
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let articles;
    articles = await Article.find(_filter).limit(reqData.pageSize).sort({ 'readCount': -1 }).skip(skip);
    if (reqData.specialId) {
        count = await Article.count(_filter);
    } else {
        count = await Article.count(_filter);
    }
    articles.forEach(item=>{
        item.createdTime = utils.formatDbDate(item.created_at)
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