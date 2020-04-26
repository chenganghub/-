var that,
  WxParse = require('../../wxParse/wxParse.js'),
  api = new(require('../../utils/api.js')),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new(require('../../utils/util.js'));
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTime:"",
    list: [],
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let actid=wx.getStorageSync("actid")
    console.log(actid,11118888888888881111)
    this.setData({actid})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 输入框点击
   */
  inputClick(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  format(i) {
    if (i < 10 && i > 0) {
      return '0' + i
    } else {
      return i
    }
  },
    /**
   * 清空按钮
   */
  deleteClick(e){
      console.log(e)
      this.setData({inputValue:""})
  },
     /**
   * 取消按钮
   */
  cancelClick(){
    // wx.navigateBack({
    //   delta: 1
    // })
    this.setData({list:[]})
  },
  /**
   * 确定
   */
  inputConfim(e) {
    console.log(e.detail.value, 777)
    api.getallgoodsactivities({
      actid: this.data.actid,
      leadername: e.detail.value
    }, res => {
      if (res.data.issuccess == 1) {
        this.setData({
          list:res.data.data
        },()=>{
    
            clearInterval(this.data.toTime)
            let than = this
            let {
              list
            } = this.data;
          // 活动结束时间 单独提出来
          let endTimeList = [];
          // 将活动的结束时间参数提成一个单独的数组，方便操作
          list.forEach(o => { endTimeList.push(o.endtime) })
          // 执行倒计时函数
          util.countDown('countDownList', endTimeList,this)
          console.log(this.data.countDownList,"countDownList")
        })
      }
    })
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
    clearInterval(this.data.toTime)
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
    //去拼团
    goGroup(e) {
      let{ item}=e.target.dataset
      wx.setStorageSync('userid', item.userid)
      wx.setStorageSync('groupid', item.id)
      wx.navigateTo({
        url: `/pages/assemble/assemble?id=${JSON.stringify(item.id)}&detailid=${item.detailid}&group=true"`,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
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