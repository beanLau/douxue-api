const router = require('koa-router')();
const Special = require('../models/special');

/**
 * 新增或修改接口
 */
router.post('/addUpdateSpecial', async (ctx) => {
    let reqData = ctx.request.body;
    let special;
    if(reqData._id){ //如果传入id了为更新操作。
        special = await Special.findOneAndUpdate({_id: reqData._id},{
            name: reqData.name,
            desc: reqData.desc,
            updated_at: Date.now()
        })
    }else{
        special = await Special.create({
            name: reqData.name,
            desc: reqData.desc,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    ctx.body = {
        code: 0,
        data: special,
        msg: 'ok'
    }
})
/**
 * 删除专题
 */
router.post('/deleteSpecial', async (ctx) => {
    let special = await Special.deleteOne({_id: ctx.request.body._id})
    ctx.body = {
        code: 0,
        data: special,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findSpecials', async (ctx) => {
    let reqData = ctx.request.body;
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    },reqData)
    const reg = new RegExp(reqData.name, 'i');
    let _filter = {
        $or: [
            { name: { $regex: reg } }
        ]
    }
    let count = 0;
    let skip = (reqData.pageIndex -1 ) * reqData.pageSize
    let specials = await Special.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    count = await Special.count(_filter);
    ctx.body = {
        code: 0,
        data: {
            list: specials,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})
/**
 * 查询所有专题接口，下拉框接口
 */
router.post('/findAllSpecials', async (ctx) => {
    let specials = await Special.find().sort({ 'created_at': -1 })
    ctx.body = {
        code: 0,
        data: {
            list: specials
        },
        msg: 'ok'
    }
})
module.exports = router