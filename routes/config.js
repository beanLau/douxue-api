const router = require('koa-router')();
const Config = require('../models/config');

/**
 * 获取全局配置信息
 */
router.post('/getConfig', async (ctx) => {
    let reqData = ctx.request.body;
    let count = await Config.count();
    let detail
    if(count > 0){
        detail = await Config.findOne();
    }else{
        detail = await Config.create({});
    }
    // await Config.findOneAndUpdate({ _id: reqData.id }, {
    //     readCount: questionDetail.readCount + 1
    // })
    ctx.body = {
        code: 0,
        data: detail,
        msg: 'ok'
    }
})


/**
 * 修改是否强制授权状态
 */
router.post('/changeAuthorStatus', async (ctx) => {
    let reqData = ctx.request.body;
    let config;
    config = await Config.findOneAndUpdate({}, {
        isForceAuthorize: reqData.isForceAuthorize
    })
    ctx.body = {
        code: 0,
        data: config,
        msg: 'ok'
    }
})

module.exports = router