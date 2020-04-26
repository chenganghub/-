// pages/integralmall/Integralmall.js
var that,
  api = new (require('../../utils/api.js')),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new (require('../../utils/util.js'));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagesize:20,
    start:0,
    goods:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    that.getdata()
  },
  getdata(){
    let{pagesize,start,goods} = that.data
    api.getscoregoodslist({ pagesize, start }, res => {
      if (res.data.issuccess == 1) {
        console.log(res,'res')
        res.data.list.forEach((x, i) => {
          console.log(x, 'xxxx')
          let newsrc = headimg + x.topimg
          // promotionprice = (x.promotionprice / 100).toFixed(2);
          // console.log(newsrc,'newsrcnewsrcnewsrc')
          goods.push([x, newsrc])
        })
        that.setData({ goods, reachbtm: goods.length == res.data.total })
        console.log(goods)
      }
    })
  },
  jumptogoodsdetail(e){
    let { id } = e.currentTarget.dataset;
    console.log(e, 'idid')
    wx.navigateTo({
      url: '../integraldetails/integraldetails?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    that.setData({ start: that.data.start + that.data.pagesize }, () => {
      // console.log(that.data.start,'start')
      if (reachbtm) {
        return
      }
      that.getdata()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})