// pages/mykitchen/mykitchen.js
var that,
  api = new (require('../../utils/api.js'))(),
  headimg = api.getimgurl();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../pic/avatar.png', //用户头像
    nickname: '点击登录', //用户昵称
    name: '',
    headimg,
    showList: [],
    start: 0,
    pagesize: 20,
    popularity: 0,
    showindex: 0,
    total: 0,
    fans: 0,
    follow: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.getdata();
  },
  getdata() {
    let {
        pagesize,
        start,
        popularity,
        total,
        showindex,
        follow,
        fans
      } = that.data,
      showList = [];
    if (start > 0) showList = that.data.showList;
    api.getmyshowlist({ pagesize, start }, res => {
      if (res.data.issuccess == 1) {
        total = res.data.total;
        res.data.list.forEach(x => {
          console.log(x, 'xxx');
          x.imgurl = x.item.imgurls.split(',')[0];
          showindex = x.item.browsernum + x.favorcount + showindex;
          popularity = x.item.browsernum + popularity;
          showList.push(x);
        });
      }
      that.setData({
        showList,
        rank: res.data.rank,
        popularity,
        total,
        showindex
      });
      console.log(popularity, 'popularitypopularity');
      api.getfolloworfanscounts(res => {
        if (res.data.issuccess == 1) {
          console.log(res.data.fans);
          fans = res.data.fans;
          follow = res.data.follow;
          that.setData({ follow, fans });
        }
      });
    });
  },
  loaduserinfo(info) {
    this.setData({
      avatarUrl: info.avatarUrl,
      nickname: info.nickName,
      haslogin: !0
    });
  },
  getuserinfo(e) {
    let { userInfo } = e.detail;
    this.loaduserinfo(userInfo);
    let user = wx.getStorageSync('user')
    user.avatarUrl = userInfo.avatarUrl
    user.nickname = userInfo.nickName
    wx.setStorageSync('user', user)
  },
  mytidings() {
    console.log(1);
    wx.navigateTo({
      url: '../mytidings/mytidings'
    });
  },
  toshowdetail(e) {
    wx.navigateTo({
      url: '../showDetails/showDetails?i=' + e.currentTarget.dataset.id
    });
  },
  delectshow(e) {
    console.log(111);
    let { id, index } = e.currentTarget.dataset,
      { showList, start, pagesize } = this.data;
    wx.showModal({
      title: '删除秀秀',
      content: '确认删除吗？',
      confirmColor: '#FE8F71',
      success: function(res) {
        // api.delshowlist({id,start,pagesize}, res => {
        // if (res.data.issuccess == 1) {
        // console.log("成功删除");
        // showList.splice(index, 1);
        // if (showList.length > 0) {
        //   that.setData({
        //     showList
        //   });
        // } else {
        // that.setData({
        //     showList: []
        //   });
        // }
        // }
        // });
      }
    });
  },
  tofollow() {
    wx.navigateTo({
      url: '../follow/follow'
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let userinfo = wx.getStorageSync('user');
    // , info = userinfo["userinfo"];
    if (userinfo) {
      this.setData({ userinfo });
      this.loaduserinfo(userinfo);
    }
  },

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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
