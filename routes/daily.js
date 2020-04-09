const router = require('koa-router')()
const Daily = require('../models/dailyPractice')
var moment = require('moment')

/**
 * 删除标签
 */
router.post('/deleteDaily', async (ctx) => {
    let tag = await Daily.deleteOne({_id: ctx.request.body._id})
    ctx.body = {
        code: 0,
        data: tag,
        msg: 'ok'
    }
})
/**
 * 列表分页查询接口
 */
router.post('/findDailys', async (ctx) => {
    let reqData = ctx.request.body;
    reqData = Object.assign({
        pageSize: 10,
        pageIndex: 1
    },reqData)

    let count = 0;
    let skip = (reqData.pageIndex -1 ) * reqData.pageSize
    let dailys = await Daily.find().limit(reqData.pageSize).sort({ 'created_at': -1 }).skip(skip).lean();
    dailys.map(item=>{
        item.created_at = moment(item.created_at).format('YYYY-MM-DD')
    })
    count = await Daily.count();
    ctx.body = {
        code: 0,
        data: {
            list: dailys,
            pageSize: reqData.pageSize,
            pageIndex: reqData.pageIndex,
            total: count
        },
        msg: 'ok'
    }
})

module.exports = router