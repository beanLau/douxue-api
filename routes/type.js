const router = require('koa-router')();
const Type = require('../models/type');

/**
 * 新增或修改接口
 */
router.post('/addUpdateType', async (ctx) => {
    let reqData = ctx.request.body;
    let type;
    if (reqData._id) { //如果传入id了为更新操作。
        type = await Type.findOneAndUpdate({ _id: reqData._id }, {
            name: reqData.name,
            url: reqData.url,
            updated_at: Date.now()
        })
    } else {
        type = await Type.create({
            name: reqData.name,
            url: reqData.url,
            created_at: Date.now(),
            updated_at: Date.now()
        })
    }
    ctx.body = {
        code: 0,
        data: type,
        msg: 'ok'
    }
})
/**
 * 删除标签
 */
router.post('/deleteType', async (ctx) => {
    let type = await Type.deleteOne({ _id: ctx.request.body._id })
    ctx.body = {
        code: 0,
        data: type,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findTypes', async (ctx) => {
    let reqData = ctx.request.body;
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    }, reqData)
    const reg = new RegExp(reqData.name, 'i');
    let _filter = {
        $or: [
            { name: { $regex: reg } }
        ]
    }
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let types = await Type.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    count = await Type.count(_filter);
    ctx.body = {
        code: 0,
        data: {
            list: types,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})

router.post('/findTypesByPid', async (ctx) => {
    let reqData = ctx.request.body;
    let types = await Type.find({ pid: reqData.pid }).sort({ 'created_at': -1 });
    let childTypes;
    types.forEach(async (item) => {
        childTypes = await Type.find({ pid: item._id }).sort({ 'created_at': -1 });
        if (Array.isArray(childTypes) && childTypes.length > 0) {
            item.hasChildren = true
        }
    })
    ctx.body = {
        code: 0,
        data: {
            list: types
        },
        msg: 'ok'
    }
})
/**
 * 查询所有标签接口，下拉框接口
 */
router.post('/findAllTypes', async (ctx) => {
    let types = await Type.find().sort({ 'created_at': -1 })
    ctx.body = {
        code: 0,
        data: {
            list: types
        },
        msg: 'ok'
    }
})
module.exports = router