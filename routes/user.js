const router = require('koa-router')();
const User = require('../models/user');
const jsonwebtoken = require("jsonwebtoken")

//登陆接口
router.post('/login', async (ctx) => {
    const { body } = ctx.request;
    if(body.username === "liuweitao" && body.password === "weitao901127"){
        ctx.body = {
            code: 0,
            msg: '登录成功',
            data: {
                user: {
                    username: "liuweitao",
                    password: "weitao901127"
                },
                // 生成 token 返回给客户端
                token: jsonwebtoken.sign({
                    data: body,
                    // 设置 token 过期时间
                    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
                },"jwt_douxue"),
            }
        }
        ctx.status = 200
        return;
    }
    try {
      const user = await User.findOne({ username: body.username });
      if (!user) {
        ctx.body = {
            code: 1,
            data: {},
            msg: '用户名或密码错误！'
        }
        return;
      }
      // 匹配密码是否相等
      if (body.password == user.password) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          data: {
            user: user.userInfo,
            // 生成 token 返回给客户端
            token: jsonwebtoken.sign({
                data: user,
                // 设置 token 过期时间
                exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
            },"jwt_douxue"),
          }
          
        }
      } else {
        ctx.body = {
            code: 1,
            data: {},
            msg: '用户名或密码错误！'
        }
      }
    } catch (error) {
      ctx.throw(500)
    }
})
/**
 * 新增或修改接口
 */
router.post('/addUpdateUser', async (ctx) => {
    let reqData = ctx.request.body;
    let user;
    if(reqData._id){ //如果传入id了为更新操作。
        user = await User.findOneAndUpdate({_id: reqData._id},{
            name: reqData.name,
            updated_at: Date.now()
        })
    }else{
        user = await User.create({
            name: reqData.name,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    ctx.body = {
        code: 0,
        data: user,
        msg: 'ok'
    }
})
/**
 * 删除标签
 */
router.post('/deleteUser', async (ctx) => {
    let user = await User.deleteOne({_id: ctx.request.body._id})
    ctx.body = {
        code: 0,
        data: user,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findUsers', async (ctx) => {
    let reqData = ctx.request.body;
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    },reqData)
    const reg = new RegExp(reqData.userName, 'i');
    let _filter = {
        $or: [
            { userName: { $regex: reg } }
        ]
    }
    let count = 0;
    let skip = (reqData.pageIndex -1 ) * reqData.pageSize
    let users = await User.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    count = await User.count(_filter);
    ctx.body = {
        code: 0,
        data: {
            list: users,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})
/**
 * 查询所有标签接口，下拉框接口
 */
router.post('/findAllUsers', async (ctx) => {
    let users = await User.find().sort({ 'created_at': -1 })
    ctx.body = {
        code: 0,
        data: {
            list: users
        },
        msg: 'ok'
    }
})
module.exports = router