var that,
  api = new(require('../../utils/api.js'))(),
  headimg = api.getimgurl(),
  app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headimg,
    start: 0,
    total: 0,
    fans: 0,
    follow: 0,
    showListLeft: [],
    showListRight: [],
    btns: [{
        src: '../pic/dfk.png',
        text: '待付款',
        c: 1
      },
      {
        src: '../pic/dfh.png',
        text: '待发货',
        c: 2
      },
      {
        src: '../pic/dsh.png',
        text: '待收货',
        c: 3
      },
      {
        src: '../pic/tk.png',
        text: '退款',
        c: 4
      }
    ],
    score: 0,
    dots: [0, 0, 0],
    list: [],
    mine: [],
    switchtab: 1,
    pagesize: 100,
    start: 0,
    favorcount: 0,
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // wx.showLoading({
    //   title: '加载中'
    // });
    // that.getdata();
  },
  getdata() {
    that = this;
    let showListLeft = [],
      showListRight = [],
      {
        pagesize,
        start,
        total,
        fans,
        follow
      } = this.data;
    api.getmyshowlist({
        pagesize,
        start
      },
      res => {
        if (res.data.issuccess == 1) {
          total = res.data.total;
          res.data.list.forEach((x, index) => {
            console.log(x, 'xxx');
            x.imgurl = x.item.imgurls.split(',')[0];
            //showindex = x.item.browsernum + x.favorcount + showindex
            //popularity = x.item.browsernum + popularity
            if (index % 2 == 0) {
              showListLeft.push(x);
            } else {
              showListRight.push(x);
            }
          });
        }
        that.setData({
          showListLeft,
          showListRight,
          rank: res.data.rank,
          total
        });
        //console.log(popularity, "popularitypopularity")
      }
    );

    api.getfolloworfanscounts(res => {
      if (res.data.issuccess == 1) {
        console.log(res.data.fans);
        fans = res.data.fans;
        follow = res.data.follow;
        that.setData({
          follow,
          fans
        });
      }
    });

    api.getmine(res => {
      wx.hideLoading();
      if (res.data.issuccess == 1) {
        // mine=res.data
        // that.setData({mine})
        // console.log(mine,'minemine')
        let data = res.data;
        data['focus'] = 20;
        data['fans'] = 20;
        that.setData({
          data: res.data
        });
      }
      let {
        couponcount,
        growth,
        points,
        store
      } = that.data.data;
      that.setData({
        couponcount,
        growth,
        points,
        store
      });
      const data = {
        userId: wx.getStorageSync('user').id
      };
      api.getMemberEquitys(data, res => {
        try {
          const {
            issuccess,
            data
          } = res.data;
          console.log(res);
          if (issuccess === 1) {
            this.setData({
                growthName: data.growthName
              },
              () => {
                console.log(this.data.user);
              }
            );
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
  },
  tofollow(param) {
    var type = param.currentTarget.dataset['type'];
    wx.navigateTo({
      url: '../follow/follow?type=' + type
    });
  },

  toDuty() {
    wx.navigateTo({
      url: '../memberDuty/memberDuty'
    });
  },
  toshowdetail(e) {
    wx.navigateTo({
      url: '../showDetails/showDetails?i=' + e.currentTarget.dataset.id
    });
  },

  loaduserinfo(info) {
    if (info.avatarUrl) {
      this.setData({
        avatar: info.avatarUrl,
        name: info.nickname || info.nickName,
        haslogin: true
      });
    } else {
      haslogin: false
    }
  },
  tomykitchen() {
    wx.navigateTo({
      url: '../mykitchen/mykitchen'
    });
  },
  toorder() {
    let url = '../order/order?c=0';
    wx.navigateTo({
      url
    });
  },
  tocoupon() {
    wx.navigateTo({
      url: '../mycoupon/mycoupon'
    });
  },
  toinfo() {
    wx.navigateTo({
      url: '../info/info'
    });
  },
  tointegral_growth(e) {
    let {
      index
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../integral_growth/integral_growth?index=' + index
    });
  },
  // getuserinfo(e) {
  //   if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
  //     console.log('拒绝授权')
  //   } else {
  //     wx.showLoading({
  //       title: '保存中',
  //     })
  //     let {
  //       nickName,
  //       avatarUrl
  //     } = e.detail.userInfo
  //     this.loaduserinfo(e.detail.userInfo);
  //     api.modifyUser({
  //         openid: wx.getStorageSync('openid'),
  //         nickname: nickName,
  //         avatarUrl
  //       },
  //       res => {
  //         if (res.data.issuccess == 1) {
  //           let user = wx.getStorageSync('user')
  //           wx.setStorageSync('user', {
  //             ...user,
  //             ...e.detail.userInfo,
  //             nickname: nickName
  //           })
  //           this.loginModal()
  //         }
  //         wx.hideLoading()
  //       }
  //     )
  //   }
  // },

  toaddress() {
    wx.navigateTo({
      url: '../address/address?a=1'
    });
  },
  // tocoupon(){
  //   wx.navigateTo({
  //     url: '../mycoupon/mycoupon',
  //   })
  // },

  toinvitation() {
    wx.navigateTo({
      url: '../memberDuty/memberDuty'
    });
  },
  delectshow(e) {
    let {
      id,
      index
    } = e.currentTarget.dataset, {
      total,
      start,
      pagesize
    } = this.data;
    wx.showModal({
      title: '删除秀秀',
      content: '确认删除吗？',
      confirmColor: '#FE8F71',
      success: function(res) {
        if (res.confirm) {
          api.delmycateshow({
              cid: id
            },
            res => {
              if (res.data.issuccess == 1) {
                console.log('成功删除');
                wx.showLoading({
                  title: '加载中',
                  mask: true
                });
                let showListLeft = [];
                let showListRight = [];
                api.getmyshowlist({
                    pagesize,
                    start
                  },
                  res => {
                    wx.hideLoading();
                    if (res.data.issuccess == 1) {
                      total = res.data.total;
                      res.data.list.forEach((x, itemIndex) => {
                        console.log(x, 'xxx');
                        x.imgurl = x.item.imgurls.split(',')[0];
                        //showindex = x.item.browsernum + x.favorcount + showindex
                        //popularity = x.item.browsernum + popularity
                        if (itemIndex % 2 == 0) {
                          showListLeft.push(x);
                        } else {
                          showListRight.push(x);
                        }
                      });
                    }
                    that.setData({
                      showListLeft,
                      showListRight,
                      rank: res.data.rank,
                      total
                    });
                    //console.log(popularity, "popularitypopularity")
                  }
                );
              }
            }
          );
        }
      }
    });
  },
  thumbsup(e) {
    let id = e.currentTarget.dataset.id;
    let {
      isfavor,
      favorcount
    } = that.data;
    if (e.currentTarget.dataset.isfavor == 0) {
      api.give_the_thumbs_up(id, res => {
        if (res.data.issuccess == 1) {
          // wx.showToast({
          //   title: '点赞成功',
          //   icon: 'none',
          //   duration: 1500
          // })
          favorcount = favorcount + 1;
        }
      });
    } else {
      api.give_the_thumbs_up(id, res => {
        if (res.data.issuccess == 1) {
          // wx.showToast({
          //   title: '取消成功',
          //   icon: 'none',
          //   duration: 1500
          // })
          favorcount = favorcount - 1;
        }
      });
    }
    that.getdata();
  },
  getmyicon() {
    // api.ms_mp_getlist(res=>{
    //   if(res.data.issuccess==1){
    //     this.formdata(res.data.list);
    //   }else{
    //     console.log("失败");
    //   }
    // });
  },
  mytidings() {
    wx.navigateTo({
      url: '../mytidings/mytidings'
    });
  },
  toSubmit() {
    wx.navigateTo({
      url: '../releaseshow/releaseshow'
    });
  },
  formdata(list) {
    list.forEach((x, i) => {
      if (x.picpath.indexOf('http') == -1) {
        list[i]['picpath'] = headimg + x.picpath;
      }
    });
    this.setData({
      list
    });
  },
  tocollection() {
    wx.navigateTo({
      url: '../collection/collection'
    });
  },
  toGroup() {
    wx.navigateTo({
      url: '../group/group'
    });
  },
  tomember() {
    // let {card} = this.data;
    // console.log(cardnum,"cardnum");
    // if(card.cardnum&&card.cardnum!=-1){
    //   wx.navigateTo({
    //     url: '../card/card',
    //   })
    // }else{
    wx.navigateTo({
      url: '../member/member'
    });
    // }
  },
  tomycoupon() {
    wx.navigateTo({
      url: '../mycoupon/mycoupon'
    });
  },
  tomystore() {
    wx.showModal({
      title: '提示',
      confirmColor: '#FE8F71',
      content: '功能还未开放敬请期待'
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  getdots() {
    // api.order_list('ALL',res=>{
    //   if(res.data.issuccess==1){
    //     let dots = [0, 0, 0]
    //     if(res.data.list.length>0){
    //       res.data.list.forEach(x=>{
    //         if (x.state =='NO_PAY'){
    //           dots[0]++;
    //         } else if (x.state =='PAY_SUCCESS'){
    //           dots[1]++;
    //         } else if (x.state =='SHIPPED'){
    //           dots[2]++
    //         }
    //       })
    //       that.setData({dots})
    //     }
    //   }
    // })
  },
  getscore(cb) {
    api.getscore(res => {
      if (res.data.issuccess == 1) {
        that.setData({
          score: res.data.score
        });
        cb && cb();
      }
    });
  },
  getcard() {
    var card = wx.getStorageSync('card');
    this.setData({
      card
    });
  },
  nav(e) {
    let {
      path
    } = e.currentTarget.dataset, {
      card
    } = this.data;
    if (path.indexOf('../member/member') > -1) {
      if (card.cardnum == -1) {
        wx.navigateTo({
          url: path
        });
      } else {
        wx.navigateTo({
          url: '../card/card'
        });
      }
    } else {
      wx.navigateTo({
        url: path
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.checkLogin()) {
      let userinfo = wx.getStorageSync('user');
      this.setData({
        userinfo
      });
      this.loaduserinfo(userinfo);
    } else {
      this.setData({
        haslogin: false,
        showLogin: true
      })
    }
    this.getcard();
    this.getdots();
    var cart = wx.getStorageSync('cart');
    this.getmyicon();
    that.getdata();
  },
  closeLogin() {
    this.setData({
      showLogin: false
    })
  },
  afterLogin() {
    let userinfo = wx.getStorageSync('user');
    this.loaduserinfo(userinfo);
  },
  openLogin() {
    this.setData({
      showLogin: true
    })
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
  }
});