const router = require('koa-router')();
import jsonwebtoken from 'jsonwebtoken'
const User = require('../models/user');
const utils = require('../utils');

router.post("/login",async (ctx) => {
    const { body } = ctx.request
    try {
      const user = await User.findOne({ username: body.username });
      if (!user) {
        ctx.body = {
            code: "0000001", //用户名或密码错误
            data: {},
            msg: '用户名或密码错误'
        }
        return;
      }
      // 匹配密码是否相等
      if (body.password == user.password) {
        ctx.status = 200
        ctx.body = {
          code: 0,
          msg: '登录成功',
          data: {
            user: user,
            // 生成 token 返回给客户端
            token: jsonwebtoken.sign({
                data: user,
                // 设置 token 过期时间
                exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
            }, "jwt_douxue"),
          }
        }
      } else {
        ctx.body = {
            code: "0000001", //用户名或密码错误
            data: {},
            msg: '用户名或密码错误'
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
    if (reqData._id) { //如果传入id了为更新操作。
        user = await User.findOneAndUpdate({ _id: reqData._id }, {
            name: reqData.name,
            pid: reqData.pid || '',
            url: reqData.url,
            updated_at: Date.now()
        })
    } else {
        user = await User.create({
            name: reqData.name,
            url: reqData.url,
            pid: reqData.pid || '',
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
 * 删除用户
 */
router.post('/deleteUser', async (ctx) => {
    let user = await User.deleteMany({
        $and: [
            { pid: ctx.request.body._id },
            { _id: ctx.request.body._id }
        ]
    })
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
    }, reqData)
    const reg = new RegExp(reqData.name, 'i');
    let _filter = {
        $and: [
            { name: { $regex: reg } },
            { pid: reqData.pid || '' }
        ]
    }
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let users = await User.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    count = await User.count(_filter);
    let list = []
    for (let i = 0; i < users.length; i++) {
        let user = users[i]
        let childs = await User.find({ pid: user._id });
        if (childs.length > 0) {
            user['hasChildren'] = true
        } else {
            user['hasChildren'] = false
        }
        list.push({
            _id: user._id,
            name: user.name,
            url: user.url,
            pid: user.pid,
            created_at: user.created_at,
            hasChildren: user.hasChildren
        })
    }
    ctx.body = {
        code: 0,
        data: {
            list: list,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})

router.post('/findUsersByPid', async (ctx) => {
    let reqData = ctx.request.body;
    let users = await User.find({ pid: reqData.pid }).sort({ 'created_at': -1 });
    let list = []
    for (let i = 0; i < users.length; i++) {
        let user = users[i]
        let childs = await User.find({ pid: user._id });
        if (childs.length > 0) {
            user['hasChildren'] = true
        } else {
            user['hasChildren'] = false
        }
        list.push({
            _id: user._id,
            name: user.name,
            pid: user.pid,
            url: user.url,
            created_at: user.created_at,
            hasChildren: user.hasChildren
        })
    }
    ctx.body = {
        code: 0,
        data: {
            list: list
        },
        msg: 'ok'
    }
})
/**
 * 查询所有标签接口，下拉框接口
 */
router.post('/findAllUsers', async (ctx) => {
    let users = await User.find().sort({ 'created_at': -1 })
    //let list = utils.filterArray('id','pid',users)
    ctx.body = {
        code: 0,
        data: {
            list: users
        },
        msg: 'ok'
    }
})
module.exports = router