// pages/list/list.js
var that,
  api = new(require('../../utils/api.js'))(),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new(require('../../utils/util.js'))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: undefined,
    pagesize: 20,
    start: 0,
    goods: [],
    reachbtm: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let {
      id,
      type
    } = options;
console.log(options,111)
    if (id === undefined) {
      that.getdata();
    } else if (isNaN(id) || id < 1) {
      wx.navigateBack({});
    } else {
      that.setData({
        id: options.id
      }, () => {
        that.getdata();
      });
    }

    // let{id , pagesize, start,goods,promotionprice}=that.data,page= getCurrentPages();
    // id=options.id
    // page = page[page.length-2];
    // wx.setNavigationBarTitle({
    //   title: page.data.catename,
    // })
    // that.setData({id})
  },
  getdata() {
    let {
      id,
      pagesize,
      start,
      reachbtm
    } = that.data,
      promotionprice = 0,
      goods = [];
    let urls='getCommodityGoods'
    console.log(this.options.type,"this.options.type")
      if(this.options.type&&this.options.type==1){
        urls='getCommodityGood'
      }
    api[urls]({
      pagesize,
      start,
      cid: id
    }, res => {
      if (res.data.issuccess == 1) {
        res.data.list.forEach((x, i) => {
          console.log(x, 'xxxx');
          let newsrc = headimg + x.topimg;
          promotionprice = (x.promotionprice / 100).toFixed(2);
          // console.log(newsrc,'newsrcnewsrcnewsrc')
          goods.push([x, newsrc, promotionprice]);
        });
        wx.setNavigationBarTitle({
          title: res.data.name
        });
        that.setData({
          goods,
          reachbtm: goods.length == res.data.total
        });
      }
    });
  },
  jumptogoodsdetail(e) {
    let {
      id
    } = e.currentTarget.dataset;
    console.log(e, 'idid');
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id=' + id
    });
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
  onReachBottom: function() {
    that.setData({
      start: that.data.start + that.data.pagesize
    }, () => {
      // console.log(that.data.start,'start')
      if (that.data.reachbtm) {
        return;
      }
      that.getdata();
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});