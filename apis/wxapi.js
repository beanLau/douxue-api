const dxAxios = require('./utils');

let getWxSessionKey = function(data){
    let AppID = "wxf6a8001f09abf033"
    let AppSecret = "7b11cf9e46510e770bc0148630daf58f"
    return dxAxios({ 
        method: 'get',
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${data.code}&grant_type=authorization_code`,
        body:data
    })
}
module.exports = {
    getWxSessionKey
}