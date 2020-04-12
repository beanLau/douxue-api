const router = require('koa-router')();
const Config = require('../models/config');

/**
 * 获取全局配置信息
 */
router.post('/xcxapi/getConfig', async (ctx) => {
    let reqData = ctx.request.body;
    let count = await Config.count();
    let detail
    if(count > 0){
        detail = await Config.findOne();
    }else{
        detail = await Config.create();
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



module.exports = router