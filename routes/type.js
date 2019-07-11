const router = require('koa-router')();
const Type = require('../models/type');
const utils = require('../utils');

/**
 * 新增或修改接口
 */
router.post('/addUpdateType', async (ctx) => {
    let reqData = ctx.request.body;
    let type;
    if (reqData._id) { //如果传入id了为更新操作。
        type = await Type.findOneAndUpdate({ _id: reqData._id }, {
            name: reqData.name,
            pid: reqData.pid || '',
            url: reqData.url,
            updated_at: Date.now()
        })
    } else {
        type = await Type.create({
            name: reqData.name,
            url: reqData.url,
            pid: reqData.pid || '',
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
    let type = await Type.deleteMany({
        $and: [
            { pid: ctx.request.body._id },
            { _id: ctx.request.body._id }
        ]
    })
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
        $and: [
            { name: { $regex: reg } },
            { pid: reqData.pid || '' }
        ]
    }
    let count = 0;
    let skip = (reqData.pageIndex - 1) * reqData.pageSize
    let types = await Type.find(_filter).limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip);
    count = await Type.count(_filter);
    let list = []
    for (let i = 0; i < types.length; i++) {
        let type = types[i]
        let childs = await Type.find({ pid: type._id });
        if (childs.length > 0) {
            type['hasChildren'] = true
        } else {
            type['hasChildren'] = false
        }
        list.push({
            _id: type._id,
            name: type.name,
            url: type.url,
            pid: type.pid,
            created_at: type.created_at,
            hasChildren: type.hasChildren
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

router.post('/findTypesByPid', async (ctx) => {
    let reqData = ctx.request.body;
    let types = await Type.find({ pid: reqData.pid }).sort({ 'created_at': -1 });
    let list = []
    for (let i = 0; i < types.length; i++) {
        let type = types[i]
        let childs = await Type.find({ pid: type._id });
        if (childs.length > 0) {
            type['hasChildren'] = true
        } else {
            type['hasChildren'] = false
        }
        list.push({
            _id: type._id,
            name: type.name,
            pid: type.pid,
            url: type.url,
            created_at: type.created_at,
            hasChildren: type.hasChildren
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
router.post('/findAllTypes', async (ctx) => {
    let types = await Type.find().sort({ 'created_at': -1 })
    //let list = utils.filterArray('id','pid',types)
    ctx.body = {
        code: 0,
        data: {
            list: types
        },
        msg: 'ok'
    }
})
module.exports = router