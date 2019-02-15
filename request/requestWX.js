class HTTP {
  constructor (option) {
    this.token = ''
    Object.keys(option).forEach(key => {
      this[key] = option[key]
    })
  }
  // 封装 request
  http (url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}/${url}`,
        method,
        dataType: 'json',
        data: Object.assign({
          appName: this.appName,
          token: this.token
        }, data),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => resolve(res.data),
        fail: err => {
          reject(err)
          console.log('错误码：' + err.errCode)
          console.log('错误信息：' + err.errMsg)
          wx.showToast({ title: '出错了！', icon: 'none' })
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
    const currentTime = new Date().getTime()
    return (currentTime - time) / 1000 / 60 / 60 < 2
  };
  isTokenTimeOut () {
    const tktData = wx.getStorageSync('tkt') || { tokenTime: 0 }
    const res = tktData.token && this.isOverdue(tktData.tokenTime)
    if (res) {
      this.token = tktData.token
    }
    return res
  }
  // 获取微信code
  wxlogin () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => resolve(res && res.code),
        fail: reject
      })
    })
  }
  // 获取token
  getToken() {
    const isNTO = this.isTokenTimeOut()
    if (isNTO) return Promise.resolve('')
    const url = '/getToken';
    return this.wxlogin().then(code => {
      return this.http(url, { code }, 'GET').then(res => {
        if (res.resultCode) {
          this.token = res.token
          const data = { tokenTime: Date.now(), token: res.token }
          wx.setStorageSync('tkt', data)
          return data
        } else {
          this.token = ''
          return { tokenTime: 0, token: false }
        }
      })
    })
  }
  // 是否显示真实数据
  setExamine (data) {
    const url = '/show'
    return this.request(url, {
      appName: this.appName,
      version: this.version
    }, 'POST').then(res => {
      if (res.show) this.appName = this.examineName
    })
  }

  getList() {
    const url = '/get'
    return this.request(url, { id }).then(res => res.resultCode && res.data)
  }
}

import config from './config.js'
const api = new HTTP(config)

module.exports = api