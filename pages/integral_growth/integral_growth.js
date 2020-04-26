// pages/integral_growth/integral_growth.js
var that,
  api = new(require('../../utils/api.js')),
  staticimg = api.getstaticimg(),
  headimg = api.getimgurl(),
  md5 = require('../../utils/md5.js'),
  app = getApp(),
  util = new(require('../../utils/util.js'));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagesize: 20,
    start: 0,
    all: '',
    date: '',
    fromwhere: '',
    score: '',
    list: [],
    judge: '',
    staticimg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let {
      judge
    } = that.data;
    judge = options.index
    that.setData({
      judge
    })
    that.getdata()
  },

  bindscrolltolower() {
    let {
      reachbtm
    } = this.data;
    if (reachbtm) {
      return
    }
    that.setData({
      start: that.data.start + that.data.pagesize
    }, () => {
      that.getdata()
    })
  },

  getdata() {
    let {
      pagesize,
      start,
      judge,
      all,
      list
    } = that.data;
    if (judge == 2) {
      api.getuserscorelist({
        pagesize,
        start
      }, res => {
        wx.hideLoading({
          complete: (res) => {},
        })
        if (res.data.issuccess == 1) {
          // that.formatData(res.data.list)
          all = res.data.userscore
          console.log(res.data.userscore)
          res.data.list.forEach(x => {
            x.updateDate = util.formatTimenosecend(util.toTime(x.updateDate))
            list.push(x)
          })
          that.setData({
            all,
            list,
            reachbtm: list.length == res.data.total
          })
        }
      });
    } else {
      api.getgrowthlist({
        pagesize,
        start
      }, res => {
        wx.hideLoading({
          complete: (res) => {},
        })
        if (res.data.issuccess == 1) {
          all = res.data.growth
          res.data.list.forEach(x => {
            x.updateDate = util.formatTimenosecend(util.toTime(x.updateDate))
            list.push(x)
          })

        }
        that.setData({
          all,
          list,
          reachbtm: list.length == res.data.total
        })
      });
    }
  },
  // formatData(list){
  //   let lists=[]
  //   list.forEach(x=>{
  //     x.updateDate = util.formatTimenosecend(new Date(x.updateDate))
  //     lists.push(x)
  //   })
  //   that.setData({lists,reachbtm:list.length})
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let {
      reachbtm
    } = this.data;
    if (reachbtm) {
      return
    }
    that.setData({
      start: that.data.start + that.data.pagesize
    }, () => {
      that.getdata()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})