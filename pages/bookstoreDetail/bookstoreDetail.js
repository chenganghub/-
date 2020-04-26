const api = new (require('../../utils/api.js'))()
const WxParse = require('../../wxParse/wxParse.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    staticimg: api.getstaticimg(),
    headimg: api.getimgurl()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.getdata(options.id)
    }
  },

  getdata(id) {
    api.getBookDetail(id, res => {
      if (res.data.issuccess == 1) {
        this.setData({
          detail: res.data.data
        })
        WxParse.wxParse(
          'article',
          'html',
          decodeURIComponent(res.data.data.book),
          this,
          5
        )
      }
    })
  }
})
