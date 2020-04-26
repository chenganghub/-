var that,
  api = new (require('../../utils/api.js')),
  util = new (require('../../utils/util.js')),
  headimg = api.getimgurl() ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagesize:20,
    start:0,
    headimg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getdata()
  },

  getdata(){
    let{pagesize,start} = this.data;
    api.getnews({pagesize,start},res=>{
      if(res.data.issuccess==1){
        let list = [];
        res.data.list.forEach(x=>{
          x.topimg = x.topimg.split(',')[0]
          x['date'] = util.formatTime(new Date(x.createDate))
          list.push(x)
        })
        that.setData({list})
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})