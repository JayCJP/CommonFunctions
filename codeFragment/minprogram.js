const page = {
  data: {
    page: 1,
    totalPage: 1,
    list: []
  },
  getList () {
    const page = this.data.page
    if (page > this.data.totalPage) {
      wx.showToast({
        title: '没有更多视频了！',
        icon: 'none'
      })
      return Promise.resolve('')
    }
    wx.showLoading()
    return api.getList(page).then(res => {
      if (res.resultCode) {
        this.setData({
          list: this.data.list.concat(res.data),
          totalPage: res.totalPage,
          page: page + 1
        })
      }
      wx.hideLoading()
    })
  }
}