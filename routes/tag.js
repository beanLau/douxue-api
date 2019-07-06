const router = require('koa-router')();
const Tag = require('../models/tag');

/**
 * 新增或修改接口
 */
router.post('/addUpdateTag', async (ctx) => {
    let reqData = ctx.request.body;
    let tag;
    if(reqData._id){ //如果传入id了为更新操作。
        tag = await Tag.findOneAndUpdate({_id: reqData._id},{
            name: reqData.name,
            updated_at: Date.now()
        })
    }else{
        tag = await Tag.create({
            name: reqData.name,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    ctx.body = {
        code: 0,
        data: tag,
        msg: 'ok'
    }
})
/**
 * 删除标签
 */
router.post('/deleteTag', async (ctx) => {
    let tag = await Tag.deleteOne({_id: ctx.request.body._id})
    ctx.body = {
        code: 0,
        data: tag,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findTags', async (ctx) => {
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
    let tags = await Tag.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    count = await Tag.count(_filter);
    ctx.body = {
        code: 0,
        data: {
            list: tags,
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
router.post('/findAllTags', async (ctx) => {
    let tags = await Tag.find().sort({ 'created_at': -1 })
    ctx.body = {
        code: 0,
        data: {
            list: tags
        },
        msg: 'ok'
    }
})
module.exports = router