class HTTP {
    constructor () {
        this.token = ''
        this.baseUrl = 'baseUrl'
    }

    http (url, data = {}, method = 'GET') {
        return new Promise((resolve, reject) => {
            swan.request({
                url,
                method,
                dataType: 'json',
                data: Object.assign({
                    token: this.token
                }, data),
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: res => resolve(res.data),
                fail: err => {
                    reject(err)
                    console.log('错误码：' + err.errCode);
                    console.log('错误信息：' + err.errMsg);
                    swan.showToast({ title: '出错了！', icon: 'none' })
                }
            })
        })
    }
    request (url, data, method = 'GET') {
        if (this.isTokenTimeOut()) {
            return this.http(url, data, method)
        } else {
            return this.getToken().then(res => {
                return this.http(url, data, method)
            })
        }
    }
    // 验证token是否过期 2 个小时 
    isOverdue (time) {
        const currentTime = new Date().getTime();
        return (currentTime - time) / 1000 / 60 / 60 < 2;
    };
    isTokenTimeOut () {
        const tkt = swan.getStorageSync('tkt') || '[]';
        const tktData = JSON.parse(tkt)
        const res = tktData.token && this.isOverdue(tktData.tokenTime)
        return res
    }
    // 获取token
    getToken () {
        const url = '/getToken';
        return this.http(url, { code: 'code' }, 'GET').then(res => {
            if (res.resultCode) {
                const data = { tokenTime: Date.now(), token: res.token }
                swan.setStorageSync('tkt', JSON.stringify(data));
                this.token = res.token
                return data
            } else {
                this.token = ''
                return { tokenTime: 0, token: false }
            }
        })
    }
    // 获取某些列表
    getList (data = {}) {
        const url = '/list'
        return this.request(url, data).then(res => res.code && res.data)
    }
}

module.exports = HTTP

/* 

封装 request 请求

const http = new HTTP()
http.getList().then().catch()

适用于微信小程序 swan -> wx

git@github.com:JayCJP/CommonFunctions.git

*/