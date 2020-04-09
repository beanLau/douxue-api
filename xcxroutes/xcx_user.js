const router = require('koa-router')()
const User = require('../models/user')
const jsonwebtoken = require("jsonwebtoken")
const wxapi = require("../apis/wxapi")

//登陆接口
router.post('/xcxapi/login', async (ctx) => {
    const { body } = ctx.request;
    let ctxDATA = JSON.stringify(ctx)
    let wxRes = await wxapi.getWxSessionKey(body)
    let userDetail = await User.findOne({ openId: wxRes.openid })
    console.log(wxRes)
    if(userDetail){
        wxRes = Object.assign(wxRes,userDetail)
    }else{
        userDetail = {}
        await User.create({
            openId: wxRes.openid,
            session_key: wxRes.session_key
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

module.exports = router