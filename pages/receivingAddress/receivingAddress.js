// pages/receivingAddress/receivingAddress.js
var that,
  WxParse = require('../../wxParse/wxParse.js'),
  api = new (require('../../utils/api.js')),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new (require('../../utils/util.js'));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.getuserid()
  },
  getuserid() {
    let { userid } = app.logininfo
    console.log(userid,'useriduserid')
    let {list,id} =that.setData
    api.getaddresslist(userid, res => {
      if (res.data.issuccess == 1) {
        console.log(res,'resss')
        list=res.data.list
      }
      that.setData({ list})

    })
    that.setData({ userid })
    // console.log(userid,'useriduserid')
  },
  addAddreess() {
    let { userid, id } = that.data
    // if (id) {
      wx.navigateTo({
        url: '../addAddreess/addAddreess?userid=' + userid 
      })
    // } else {
    //   wx.navigateTo({
    //     url: '../addAddreess/addAddreess?userid=' + userid,
    //   })
    // }
  },
  edittap(e){
    console.log(e)
    
    let { userid } = that.data, { id }=e.currentTarget.dataset
    // if (id) {
      wx.navigateTo({
        url: '../addAddreess/addAddreess?userid=' + userid + '&id=' + id,
      })
    // } else {
    //   wx.navigateTo({
    //     url: '../addAddreess/addAddreess?userid=' + userid,
    //   })
    // }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})