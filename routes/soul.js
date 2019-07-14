const router = require('koa-router')();
const Soul = require('../models/soul');

/**
 * 新增或修改接口
 */
router.post('/addUpdateSoul', async (ctx) => {
    let reqData = ctx.request.body;
    let soul;
    if(reqData._id){ //如果传入id了为更新操作。
        soul = await Soul.findOneAndUpdate({_id: reqData._id},{
            content: reqData.content,
            updated_at: Date.now()
        })
    }else{
        soul = await Soul.create({
            content: reqData.content,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    ctx.body = {
        code: 0,
        data: soul,
        msg: 'ok'
    }
})
/**
 * 删除标签
 */
router.post('/deleteSoul', async (ctx) => {
    let soul = await Soul.deleteOne({_id: ctx.request.body._id})
    ctx.body = {
        code: 0,
        data: soul,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findSouls', async (ctx) => {
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
    let souls = await Soul.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    count = await Soul.count(_filter);
    ctx.body = {
        code: 0,
        data: {
            list: souls,
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
router.post('/findAllSouls', async (ctx) => {
    let souls = await Soul.find().sort({ 'created_at': -1 })
    ctx.body = {
        code: 0,
        data: {
            list: souls
        },
        msg: 'ok'
    }
})
router.post('/isTopSoul',async (ctx) => {
    await Soul.updateOne({isTop: true},{isTop: false})
    let souls = await Soul.findOneAndUpdate({_id: ctx.request.body._id},{isTop: ctx.request.body.isTop});
    ctx.body = {
        code: 0,
        data: {
            list: souls
        },
        msg: 'ok'
    }
})
module.exports = router