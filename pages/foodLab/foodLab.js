var that,
  api = new (require('../../utils/api.js'))(),
  app = getApp(),
  headimg = api.getimgurl(),
  staticimg = api.getstaticimg(),
  util = new (require('../../utils/util.js'))()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    start: 0,
    pagesize: 20,
    headimg: api.getimgurl(),
    staticimg: api.getstaticimg(),
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    that = this
    if (app.logininfo) {
      that.getdata()
    } else {
      util.setwatcher(app, this.afterlogin)
    }
    wx.removeStorage('selectItem')
  },
  afterlogin: {
    token: res => {
      that.getdata()
    }
  },
  /**
   * 登录弹窗
   */
  loginModal(cb) {
    if (!app.checkLogin()) {
      this.setData({
        showLogin: true
      })
    } else {
      this.setData({
        showLogin: false
      })
      cb && cb()
    }
  },
  closeLogin() {
    this.setData({
      showLogin: false
    })
  },
  openLogin() {
    this.setData({
      showLogin: true
    })
  },
  getdata() {
    const { start, pagesize } = this.data
    api.getlablist(
      {
        start,
        pagesize
      },
      res => {
        if (res.data.issuccess == 1) {
          that.setData({
            list: res.data.list
          })
        }
      }
    )
  },
  toBookStore(){
    this.loginModal(()=>{
      wx.navigateTo({
        url: '/pages/bookstore/bookstore',
      })
    })
  },
  todishesdetail(e) {
    this.loginModal(()=>{
      const { item } = e.currentTarget.dataset
      wx.setStorageSync('selectItem', JSON.stringify(item))
      that.setData(
        {
          selectitem: item
        },
        () => {
          wx.navigateTo({
            url: '../dishesdetail/dishesdetail'
          })
        }
      )
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
