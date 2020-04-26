const api = new(require('../../utils/api.js'))()
const WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getdata()
  },

  getdata() {
    api.getMemberRules(res => {
      if (res.data.issuccess == 1) {
        WxParse.wxParse(
          'article',
          'html',
          decodeURIComponent(res.data.list[0].textarea),
          this,
          5
        )
      }
    })
  }

})