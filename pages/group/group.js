const app = getApp()
const api = new(require('../../utils/api.js'))()
const util = new(require('../../utils/util.js'))()
// pages/group/group.js   
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [],
    joinModalVisible: false,
    startedVisible: false,
    endedVisible: false,
    group: ""
  },

  handleActive({
    target
  }) {
    const index = target.dataset.index
    console.log(index)
    this.setData({
      active: index
    })
  },

  handleCloseJoinModal() {
    this.setData({
      joinModalVisible: false
    })
  },




  // 判断活动是否已经结束
  handleEndedVisible(e) {
    let starttime = util.timeFormatting(e.detail.item.starttime)
    let endtime = util.timeFormatting(e.detail.item.endtime)

    console.log(starttime, endtime, "starttime,endtime")
    this.setData({
      starttime,
      endtime
    })
    console.log(endtime,'endtime')
    if (new Date(endtime).getTime() < new Date().getTime()) {
 
      this.setData({
        endedVisible: true
      })
    } else if(new Date(starttime).getTime() > new Date().getTime()) {
      this.setData({
        endedVisible: true
      })
    }else{
      wx.navigateTo({
        url:  '/pages/assemble/assemble?id=' + e.detail.item.id,
      })
    }

  },

  handleCloseEndedVisible() {
    this.setData({
      endedVisible: false
    })
  },
  //更多活动
  goGroup() {
    wx.switchTab({
      url: "/pages/classification/classification"
    })
  },
  // 查看已加入用户
  viewJoinUsers() {
    this.setData({
      joinModalVisible: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //转发
  onShareAppMessage: function (res) {
    console.log(res, 2222)
    if (res.from === 'button') {

    }
    return {
      title: '转发',
      path: 'pages/assemble/assemble?id=' + res.target.dataset.item.id,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})