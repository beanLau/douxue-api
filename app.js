const Koa = require('koa')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const Router = require('koa-router')
const views = require('koa-views')
const mongoose = require('mongoose')
const jwt = require('koa-jwt')
const errorHandle = require('./middle/errorHandle')

mongoose.connect('mongodb://localhost/douxue');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("链接成功")
    // we're connected!
})
const router = new Router()
const app = new Koa()

const utils = require('./routes/utils')
const article = require('./routes/article')
const tag = require('./routes/tag')
const type = require('./routes/type')
const soul = require('./routes/soul')
const user = require('./routes/user')


app.use(errorHandle).use(jwt({
    secret:"jwt_douxue"
  }).unless({
    path: [new RegExp("\/login")],
  }))

// app.use(cors({
//     origin: function (ctx) {
//         //console.log(ctx.header.host)
//         // if (ctx.header.host === 'localhost:8080') {
//         //     return '*';
//         // }
//         return '*';
//     },
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//     maxAge: 5,
//     credentials: true,
//     allowMethods: ['GET', 'POST', 'DELETE'],
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept','token'],
// }));

app.use(views('views', {
    root: __dirname + '/views',
    extension: 'jade'
}));

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}))

app.use(require('koa-static')(__dirname + '/public'));

app.use(utils.routes()).use(utils.allowedMethods())
app.use(article.routes()).use(article.allowedMethods())
app.use(tag.routes()).use(tag.allowedMethods())
app.use(type.routes()).use(type.allowedMethods())
app.use(soul.routes()).use(soul.allowedMethods())
app.use(user.routes()).use(user.allowedMethods())

module.exports = app
