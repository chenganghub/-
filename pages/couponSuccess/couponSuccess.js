const api = new (require('../../utils/api.js'))()
const app = getApp()
const headimg = api.getimgurl()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headimg: api.getimgurl(),
    staticimg: api.getstaticimg(),
    newCouponData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isIphoneX: app.globalData.isIphoneX
    })
    this.getNewUserCoupon()
  },

  toCenter() {
    wx.navigateTo({
      url: '/pages/member/member'
    })
  },

  /**
   * 新人获取优惠卷弹窗信息
   */
  getNewUserCoupon() {
    api.getNewUserCoupon(res => {
      if (res.data.issuccess === 1) {
        this.setData({
          newCouponData: res.data.data
        })
      }
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/classification/classification'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
