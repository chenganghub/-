// pages/invitation/invitation.js
var that,
  api = new(require('../../utils/api.js')),
  headimg = api.getimgurl(),
  staticimg=api.getstaticimg(),
  md5 = require('../../utils/md5.js'),
  app = getApp(),
  util = new(require('../../utils/util.js'));
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticimg,
    pagesize:20,
    start:0,
    list:[],
    total:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getdata()
  },
  getdata(){
    let{start,pagesize,list,total}=that.data
    api.getsharelist({start,pagesize},res=>{
      if(res.data.issuccess){
        console.log(res,'res')
        total=res.data.total
        console.log(total,'total') 
        that.setData({total})
        res.data.list.forEach((x,i)=>{
          // let  date=x.updateDate
          let  date = util.formatTime(new Date(x.updateDate)) 
          let updateDate= date.substring(0,date.length-3)
          total=parseInt(x.point+total)
          let item= {avatarUrl:x.avatarUrl,updateDate:updateDate,phone:x.phone}
          list.push(item)
        })
        that.setData({list,reachbtm:list.length == res.data.total})
      }
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
    let { reachbtm } = this.data;
    if (reachbtm) {
      return
    }
    that.setData({ start: that.data.start + that.data.pagesize }, () => {
      that.getdata()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})