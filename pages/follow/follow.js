// pages/follow/follow.js
var that,
  api = new (require('../../utils/api.js'))(),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new (require('../../utils/util.js'))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    switchtab: 0,
    start: 0,
    pagesize: 20,
    followlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options.type);
    this.setData(
      {
        switchtab: options.type === '0' ? 0 : 1
      },
      function() {
        that.getdata();
      }
    );
  },
  switchtap(e) {
    let { switchtab } = that.data,
      { index } = e.currentTarget.dataset;
    if (switchtab == index) return;
    this.setData(
      {
        switchtab: index,
        start: 0,
        followlist:[]
      },
      () => {
        that.getdata();
      }
    );
  },
  getdata() {
    wx.showLoading({
      title: '加载中',
      mask
    });
    let { switchtab, start, pagesize, followlist } = that.data;
    api.getfolloworfanslist(
      {
        start,
        pagesize,
        isfollow: switchtab
      },
      res => {
        wx.hideLoading({});
        if (res.data.issuccess == 1) {
          followlist = res.data.list;
          followlist.forEach(item=>{
            item.flag = true
          })
          that.setData({
            followlist
          });
        }
      }
    );
  },

  tofollow(e) {
    const { fansid, isfollow } = e.currentTarget.dataset;
    if (this.data.switchtab == 1) {
      //粉丝列表
      if (!isfollow) {
        //未关注
        wx.showLoading({
          title: '加载中',
          mask
        });
        let cateuserid = fansid;
        api.tofollow(cateuserid, res => {
          if (res.data.issuccess == 1) {
            that.getdata();
            wx.showToast({
              title: '关注成功',
              icon: 'none',
              duration: 1500
            });
          }
          wx.hideLoading();
        });
      }
    }
  },

  tofollowed(e){
    const { userid, flag, index } = e.currentTarget.dataset;
    wx.showLoading({
      title: '加载中',
      mask
    });
    let cateuserid = userid;
    let followlist = [...this.data.followlist]
    if (!flag) {
      //未关注
      api.tofollow(cateuserid, res => {
        if (res.data.issuccess == 1) {
          followlist[index].flag = true
          this.setData({
            followlist
          })
          wx.showToast({
            title: '关注成功',
            icon: 'none',
            duration: 1500
          });
        }
        wx.hideLoading();
      });
    }else{
      api.tofollow(cateuserid, res => {
        if (res.data.issuccess == 1) {
          followlist[index].flag = false
          this.setData({
            followlist
          })
          wx.showToast({
            title: '取消关注',
            icon: 'none',
            duration: 1500
          });
        }
        wx.hideLoading();
      });
    }
  }
});
