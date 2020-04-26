// pages/VoucherCenter/VoucherCenter.js
var that,
  api = new (require('../../utils/api.js'))(),
  app = getApp(),
  util = new (require('../../utils/util.js'))()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    staticimg: api.getstaticimg(),
    list: [],
    pagesize: 20,
    start: 0,
    switchtab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    that.getCoupon()
  },

  //去使用
  goToUse() {
    wx.switchTab({
      url: '/pages/classification/classification',
    })
  },
  getCoupon() {
    let { list, switchtab } = that.data
    api.getmycouponlist(switchtab, res => {
      if (res.data.issuccess == 1) {
        console.log(res.data.list, 'resres')
        list = res.data.list
      }
      console.log(list, 'list')
      list &&
        list.forEach(item => {
          if (item.coupon.type == 'MJ') {
            item.description =
              '全平台，满' + item.coupon.threshold / 100 + '元可用'
          } else {
            item.description =
              '全平台，最大折扣金额' + item.coupon.threshold / 100 + '元'
          }
        })
      that.setData({ list })
    })
  },
  // receivecoupon(e){
  //   let {id,got} = e.currentTarget.dataset;
  //   if(got){
  //     util.nocancelmodal("已经领取过",'提示')
  //     return;
  //   }
  //   console.log(e.currentTarget.dataset,'eee')
  //   api.receivecoupon(id,res => {
  //     if (res.data.issuccess == 1) {

  //       that.getCoupon()
  //     }else{
  //       wx.showModal({
  //         title:'提示',
  //         content:res.data.msg,
  //         showCancel:!1
  //       })
  //     }
  //   })
  // },
  switchtab(e) {
    let { switchtab } = that.data,
      { index } = e.currentTarget.dataset
    if (switchtab === index) {
      return false
    } else {
      that.setData({
        switchtab: index,
        list: []
      })
    }
    that.getCoupon()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
