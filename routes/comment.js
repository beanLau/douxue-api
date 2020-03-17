const router = require('koa-router')();
const Comment = require('../models/comment');
const User = require('../models/user')
const jsonwebtoken = require("jsonwebtoken")
const utils = require('../utils')
const wxapi = require("../apis/wxapi")

/**
 * 新增或修改接口
 */
router.post('/xcxapi/addComment', async (ctx) => {
    let reqData = ctx.request.body;
    let authorization = ctx.headers.authorization.split(" ")
    let token = ""
    let decoded = ""
    let user
    let comment
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
    decoded = jsonwebtoken.verify(token, 'douxue');//通过token解析用户信息
    let accessTokenObj = await wxapi.getAccessToken()
    let access_token = accessTokenObj.access_token;
    if(accessTokenObj.expires_in){
        global.accessTokenObj = {
            access_token: access_token,
            time: Date.now() + 1000 * 60 * 110
        }
    }
    
    //验证内容是否合法
    let msgCheckRes = await wxapi.msgSecCheck({
        access_token: access_token,
        content: reqData.content
    })
    if(msgCheckRes.errcode == "87014"){
        msg = "内容含有违法违规内容"
        ctx.body = {
            code: 1,
            data: msgCheckRes.errmsg,
            msg: "内容含有违法违规内容"
        }
        return
    }
    
    user = await User.findOneAndUpdate({openId: decoded.data.openid},reqData)
    comment = await Comment.create({
        articleId: reqData.articleId,
        content: reqData.content,
        avatarUrl: user.avatarUrl,
        nickName: user.nickName,
        created_at: Date.now(),
        updated_at: Date.now()
    })
    ctx.body = {
        code: 0,
        data: comment,
        msg: 'ok'
    }

    // if (reqData._id) { //如果传入id了为更新操作。
    //     article = await Comment.findOneAndUpdate({ _id: reqData._id }, {
    //         content: reqData.content,
    //         avatarUrl: reqData.avatarUrl,
    //         nickName: reqData.nickName,
    //         updated_at: Date.now()
    //     })
    // } 
})


/**
 * 管理端列表分页查询接口
 */
router.post('/findComments', async (ctx) => {
    let reqData = ctx.request.body;
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    },reqData)
    const reg = new RegExp(reqData.content, 'i');
    let _filter = {
        $or: [
            { content: { $regex: reg } }
        ]
    }
    let count = 0;
    let skip = (reqData.pageIndex -1 ) * reqData.pageSize
    let comment = await Comment.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip).lean();
    count = await Comment.count(_filter);
    comment.forEach(item=>{
        item.created_at = utils.formatDbDate(item.created_at)
    })
    ctx.body = {
        code: 0,
        data: {
            list: comment,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})


/**
 * 删除评论
 */
router.post('/deleteComment', async (ctx) => {
    let comment = await Comment.deleteOne({_id: ctx.request.body._id})
    ctx.body = {
        code: 0,
        data: comment,
        msg: 'ok'
    }
})



/**
 * 根据文章id查询评论列表
 */
router.post('/findCommentsByArticleId', async (ctx) => {
    let reqData = ctx.request.body;
    if(!reqData.articleId){
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
    let _filter = {"articleId": reqData.articleId}
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let comments;
    comments = await Comment.find(_filter).limit(reqData.pageSize).sort({ 'create_at': -1 }).skip(skip).lean();
    if (reqData.articleId) {
        count = await Comment.count(_filter);
    } else {
        count = await Comment.count(_filter);
    }
    comments.forEach(item=>{
        item.created_at = utils.formatDbDate(item.created_at)
    })
    ctx.body = {
        code: 0,
        data: {
            list: comments,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})

module.exports = router