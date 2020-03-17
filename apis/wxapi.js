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

let msgSecCheck = function(data){
    let AppID = "wxf6a8001f09abf033"
    let AppSecret = "7b11cf9e46510e770bc0148630daf58f"
    return dxAxios({ 
        method: 'POST',
        url: `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${data.access_token}`,
        body: {
            content: data.content
        }
    })
}

let getAccessToken = function(data){
    let AppID = "wxf6a8001f09abf033"
    let AppSecret = "7b11cf9e46510e770bc0148630daf58f"
    let accessTokenObj = global.accessTokenObj || null
    //如果全局有保存accessToken并且没有过期
    if(accessTokenObj && accessTokenObj.access_token && accessTokenObj.time > Date.now()){
        return new Promise((resolve, reject) => {
            resolve(accessTokenObj)
        })
    }else{
        return dxAxios({ 
            method: 'get',
            url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${AppID}&secret=${AppSecret}`
        })
    }
    
}
module.exports = {
    getWxSessionKey,
    msgSecCheck,
    getAccessToken
}