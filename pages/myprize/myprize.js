// pages/myprize/myprize.js
var that,
  api = new (require("../../utils/api.js"))(),
  app = getApp(),
  headimg = api.getimgurl(),
  staticimg = api.getstaticimg(),
  util = new (require("../../utils/util.js"))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    start: 0,
    pagesize: 10,
    list: [],
    staticimg,
    // data:[
    //   {
    //     id:1,
    //     name:"积分1",
    //     time:'2020-01-04T10:30',
    //     type:2,
    //     state:"已兑换"
    //   },
    //   {
    //     id:2,
    //     name:"积分100",
    //     time:'2020-01-05T10:30',
    //     type:2,
    //     state:"已兑换"
    //   },
    //   {
    //     id:3,
    //     name:"储存金",
    //     time:'2020-01-07T10:30',
    //     type:0,
    //     state:"领取"
    //   },
    //   {
    //     id:4,
    //     name:"芒果500斤",
    //     time:'2020-01-10T10:30',
    //     type:3,
    //     state:"查看门店"
    //   },
    // ]
    isaward: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.getdata();
    // let {data}=that.data
    // data.forEach((x,i)=>{
    //   x.time=x.time.replace(/[T]/g, " ")
    // })
    // that.setData({data})
  },
  getdata() {
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    let { start, pagesize, list } = that.data;
    if (start == 0) list = [];
    api.getmyawardlist({ start, pagesize }, res => {
      wx.hideLoading();
      if (res.data.issuccess == 1) {
        // let {list,total}=res.data
        res.data.list.forEach((x, i) => {
          x.used = x.used == "T";
          if (x.award.type == -1) {
            return;
          } else {
            x.award.updateDate = util.myTime(x.award.updateDate).substr(0, 10);
            list.push(x);
          }
        });

        that.setData({ list, totals: res.data.total });
      }
    });
  },
  getaward(e) {
    let { index, type, id, goodsid } = e.currentTarget.dataset,
      item = this.data.list[index],
      { isaward } = that.data;
    console.log(id, "typetype");
    if (!item["used"]) {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      if (type == 3) {
        wx.navigateTo({
          url:
            "../confirm/confirm?id=" +
            id +
            "&isaward=" +
            isaward +
            "&goodsid=" +
            goodsid
        });
      } else {
        api.getawardsintopocket(item.id, res => {
          wx.hideLoading();
          let content = res.data.issuccess == 1 ? "领取成功" : res.data.msg;
          util.nocancelmodal(content);
          that.setData({ start: 0 }, () => {
            that.getdata();
          });
        });
      }
    }
  },

  back() {
    wx.navigateBack({})
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  bindscrolltolower() {
    let { pagesize, start, totals } = that.data;
    start = pagesize + start;
    if (start < totals) {
      that.setData({ start }, () => {
        that.getdata();
      });
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
