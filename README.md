### 该项目为都学前端小程序的接口服务器
#### 使用教程
1. clone 或下载项目到本地
2. npm i  安装js依赖包
3. 安装mongodb数据库 cmd命令行bin目录执行mongod启动mongodb服务。
4. npm run dev  启动本地服务

默认3000端口,项目起来后可以先用postman测试接口，接口在routes文件夹中定义。

#### 目录结构说明
```javascript
|--apis //调用的第三方服务器接口定义
|--middle   //中间件
|--models //Schema定义
|--public //静态资源
|--|--images //图片资源，admin管理端图片上传保存位置
|--routes //路由规则定义
|--utils //工具方法
|--xcxroutes //小程序专用接口
```
![小程序体验地址](http://manage.douxue.top/images/douxuexcx.jpg)