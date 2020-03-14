const axios = require('axios')
const apiUrl = "/xcxapi"
const dxAxios = function (options,ctx) {
    ctx = ctx || {}
    let token,url = options.url
    if (!url) {
        throw new Error('请传入uri地址')
    }
    if(url.indexOf('http') == -1){
        url = apiUrl + url
    }
    options.body = options.body || {}
    return new Promise((resolve, reject) => {
        let def = {
            method: options.method || 'POST',
            headers: {
                "content-type": "application/json;charset=utf-8"
            },
            url: url,
            data: options.body
        }

        axios(def).then(res=>{
            resolve(res.data)
        }).catch((e)=>{
            reject({
                code: 2,
                data:{},
                msg: ""
            })
        })
    })
}

const dxAxiosAll = function(){
    return Promise.all(arguments)
}
module.exports = dxAxios;