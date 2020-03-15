const router = require('koa-router')();
const fs = require('fs')
const path = require('path')
/**
 * 新增或修改接口
 */
router.post('/upload', async (ctx) => {
    const file = ctx.request.files.file;
    let beginIndex = file.name.lastIndexOf(".")
    let fileName = file.name.substr(beginIndex,file.name.length -1);
    fileName = Date.now() + fileName;

    const reader = fs.createReadStream(file.path);

    let filePath = path.resolve(__dirname, '..') + "/public/images/";

    let fileResource = filePath + `/${fileName}`;

    let upstream = fs.createWriteStream(fileResource)
    reader.pipe(upstream);
    ctx.body = {
        code: 0,
        data: {
            url: `http://manage.douxue.top/images/${fileName}`
        },
        msg: 'ok'
    }
})
module.exports = router