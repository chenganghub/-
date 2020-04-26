var that,
  api = new (require("../../utils/api.js"))(),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new (require("../../utils/util.js"))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pagesize: 10,
    start: 0,
    headimg,
    switchtab: 1,
    showList: [],
    showListLeft: [],
    showListRight: [],
    isfavor: "",
    favorcount: "",
    id: 0,
    reachbtm: false,
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    if (app.logininfo) {
      that.getdata();
    } else {
      util.setwatcher(app, this.afterlogin);
    }
    this.setData({
      login: app.logininfo
    });
    if (options.share) {
      addShare(options.share);
    }
  },
  afterlogin: {
    token: res => {
      that.getdata();
    }
  },
  addShare(shareid) {
    api.share(shareid, getCurrentPages()[0].route, res => {
      if (res.data.issuccess) {
        console.log(res, "res");
      }
    });
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
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    let { pagesize, start, switchtab, showListLeft, showListRight } = that.data;
    if (switchtab == 1) {
      api.getshowlist(
        {
          pagesize,
          start,
          userid: wx.getStorageSync("user").id
        },
        res => {
          wx.hideLoading({
            complete: res => {}
          });
          if (res.data.issuccess == 1) {
            that.setData({
              reachbtm:
                showListLeft.length + showListRight.length == res.data.total
            });
            that.formatData(res.data.list);
          }
        }
      );
    } else {
      //关注接口
      api.getshowfocuslist(
        {
          pagesize,
          start,
          userid: wx.getStorageSync("user").id
        },
        res => {
          wx.hideLoading({
            complete: res => {}
          });
          if (res.data.issuccess == 1) {
            that.setData({
              reachbtm:
                showListLeft.length + showListRight.length == res.data.total
            });
            that.formatData(res.data.list);
          }
        }
      );
    }
  },
  formatData(list) {
    let isfavor = "",
      favorcount = 0,
      showListLeft = this.data.start == 0 ? [] : that.data.showListLeft,
      showListRight = this.data.start == 0 ? [] : that.data.showListRight;
    list.forEach((x, index) => {
      x.imgurl = x.item.imgurls.split(",")[0];
      isfavor = x.isfavor;
      favorcount = x.isfavor;
      if (index % 2 == 0) {
        showListLeft.push(x);
      } else {
        showListRight.push(x);
      }
    });
    that.setData({
      showListLeft,
      showListRight,
      isfavor,
      favorcount
    });
  },

  bindGetUserInfo: function(e) {
    let { nickName, avatarUrl } = e.detail.userInfo;
    api.modifyUser(
      {
        openid: wx.getStorageSync("openid"),
        nickname: nickName,
        avatarUrl
      },
      res => {
        if (res.data.issuccess == 1) {
          let user = wx.getStorageSync("user");
          user.avatarUrl = avatarUrl;
          user.nickname = nickName;
          wx.setStorageSync("user", user);
          wx.navigateTo({
            url: "../releaseshow/releaseshow"
          });
        }
      }
    );
  },
  switchtap(e) {
    let { switchtab } = that.data,
      { index } = e.currentTarget.dataset;
    this.loginModal(() => {
      if (switchtab == index) return;
      this.setData(
        {
          switchtab: index,
          start: 0
        },
        () => {
          that.getdata();
        }
      );
    })
  },
  tomykitchen() {
    wx.navigateTo({
      url: "../mykitchen/mykitchen"
    });
  },
  toshowdetail(e) {
    this.loginModal(()=>{
      wx.navigateTo({
        url: "../showDetails/showDetails?i=" + e.currentTarget.dataset.id
      })
    })
  },
  toRelease() {
    this.loginModal(()=>{
      wx.navigateTo({
        url: "../releaseshow/releaseshow"
      });
    })
  },
  thumbsup(e) {
    this.loginModal(()=>{
      const { type, isfavor, index, id } = e.currentTarget.dataset;
      const showListLeft = JSON.parse(JSON.stringify(that.data.showListLeft));
      const showListRight = JSON.parse(JSON.stringify(that.data.showListRight));
      const listItem = type === 'left' ? showListLeft[index] : showListRight[index];
      const item = Object.assign({}, listItem, {
        favorcount: isfavor === 0 ? listItem.favorcount + 1 : listItem.favorcount - 1,
        isfavor: isfavor === 0 ? 1 : 0
      });
      if (type === 'left') {
        showListLeft.splice(index, 1, item)
      } else {
        showListRight.splice(index, 1, item)
      }
      api.give_the_thumbs_up(id, res => {
        if (res.data.issuccess == 1) {
          that.setData({
            showListLeft: showListLeft,
            showListRight: showListRight
          })
        }
      });
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    console.log(e);
    if (app.logininfo) {
      that.setData(
        {
          start: 0
        },
        () => {
          that.getdata();
        }
      );
    }
  },

  imageLoad(e) {
    console.log(e);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: "/pages/foodsShow/foodsShow?share=" + wx.getStorageSync("user").id
    };
  },
  onReachBottom: function() {
    let { reachbtm } = this.data;
    if (reachbtm) {
      return;
    }
    that.setData(
      {
        start: that.data.start + that.data.pagesize
      },
      () => {
        that.getdata();
      }
    );
  }
});
