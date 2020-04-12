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
const special = require('./routes/special')
const soul = require('./routes/soul')
const user = require('./routes/user')
const comment = require('./routes/comment')
const question = require('./routes/question')
const daily = require('./routes/daily')
const config = require('./routes/config')

//小程序接口路由规则
const xcx_user = require('./xcxroutes/xcx_user')
const xcx_articles = require('./xcxroutes/xcx_articles')
const xcx_daily = require('./xcxroutes/xcx_daily')
const xcx_question = require('./xcxroutes/xcx_question')
const xcx_config = require('./xcxroutes/xcx_config')


app.use(errorHandle).use(jwt({
    secret:"douxue"
  }).unless({
    path: [new RegExp("\/login"),new RegExp("\/upload"),new RegExp("\/images")],
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
app.use(special.routes()).use(special.allowedMethods())
app.use(soul.routes()).use(soul.allowedMethods())
app.use(user.routes()).use(user.allowedMethods())
app.use(comment.routes()).use(comment.allowedMethods())
app.use(question.routes()).use(question.allowedMethods())
app.use(daily.routes()).use(daily.allowedMethods())
app.use(config.routes()).use(config.allowedMethods())

app.use(xcx_user.routes()).use(xcx_user.allowedMethods())
app.use(xcx_articles.routes()).use(xcx_articles.allowedMethods())
app.use(xcx_daily.routes()).use(xcx_daily.allowedMethods())
app.use(xcx_question.routes()).use(xcx_question.allowedMethods())
app.use(xcx_config.routes()).use(xcx_config.allowedMethods())

module.exports = app
