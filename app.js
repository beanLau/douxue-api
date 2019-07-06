const Koa = require('koa')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const Router = require('koa-router')
const views = require('koa-views')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/douxue');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("链接成功")
    // we're connected!
})
const router = new Router()
const app = new Koa()

const article = require('./routes/article')
const tag = require('./routes/tag')
const type = require('./routes/type')

app.use(cors({
    origin: function (ctx) {
        //console.log(ctx.header.host)
        // if (ctx.header.host === 'localhost:8080') {
        //     return '*';
        // }
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(views('views', {
    root: __dirname + '/views',
    extension: 'jade'
}));

app.use(koaBody())

app.use(require('koa-static')(__dirname + '/public'));

app.use(article.routes()).use(article.allowedMethods())
app.use(tag.routes()).use(tag.allowedMethods())
app.use(type.routes()).use(type.allowedMethods())

module.exports = app
