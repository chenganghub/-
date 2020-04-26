var that,
  api = new (require('../../utils/api.js'))(),
  app = getApp(),
  headimg = api.getimgurl(),
  util = new (require('../../utils/util.js'))();

function formatTime(str, date) {
  let nowa = Date.parse(new Date()) / 1000;
  let a = Math.abs(nowa - str);
  if (Math.floor(a) < 60) {
    // console.log(Math.floor(a/1000),'秒');
    if (Math.floor(a) === 0) {
      return '刚刚';
    }
    return Math.floor(a) + '秒前';
  } else if (Math.floor(a) < 60 * 60) {
    // console.log(Math.floor(a/1000/60),'分');
    return Math.floor(a / 60) + '分钟前';
  } else if (Math.floor(a) < 60 * 60 * 24) {
    // console.log(Math.floor(a/1000/60/60),'小时');
    return Math.floor(a / 60 / 60) + '小时前';
  } else if (Math.floor(a) < 60 * 60 * 24 * 10) {
    // console.log(Math.floor(a/1000/60/60),'小时');
    return Math.floor(a / 60 / 60 / 24) + '天前';
  } else {
    return util.toCurrentDate(new Date(date));
  }
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totals: '',
    headimg,
    imgUrls: [],
    indicatorDots: true, //小点
    indicatorColor: '#E5E5E5', //指示点颜色
    activeColor: '#000000', //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 2000, //间隔时间
    duration: 500, //滑动时间
    circular: true,
    start: 0,
    pagesize: 20,
    id: 0,
    contents: '',
    contentslist: [],
    list: [],
    mobileModel: '',
    report: '',
    reportid: 0,
    isIphoneX: false,
    inputFlag: false,
    contents: '',
    showDeleteUser: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(wx.getStorageSync('user'));
    let { id, mobileModel } = that.data;
    id = options.i;
    console.log(id);
    that.setData(
      {
        id: options.i,
        myId: wx.getStorageSync('user').id,
        shareid: options.share || 0,
        isIphoneX: app.globalData.isIphoneX
      },
      () => {
        if (app.checkLogin()) {
          that.getdata(options.i);
        } else {
          wx.switchTab({
            url: '/pages/classification/classification',
          })
        }
      }
    );
  },
  //前端获取美食评论列表
  getcontentslist() {
    let { id, pagesize, start, totals, contentslist } = that.data;
    api.getcontentslist(
      {
        id,
        pagesize,
        start
      },
      res => {
        if (res.data.issuccess == 1) {
          console.log(res.data.list, 'res');
          console.log(res.data.total, 'total');
          if (start === 0) {
            contentslist = [];
          }
          res.data.list.forEach(x => {
            x['date'] = formatTime(x.date, x.item.createDate);
            x['show'] = false;
            contentslist.push(x);
          });
          totals = res.data.total;
        }
        that.setData({
          contentslist,
          totals
        });
      }
    );
  },
  delectshow() {
    that = this;
    let { id } = that.data;
    wx.showModal({
      title: '删除秀秀',
      confirmColor: '#FE8F71',
      content: '确认删除吗？',
      success: function(res) {
        if (res.confirm) {
          api.delmycateshow(
            {
              cid: id
            },
            res => {
              if (res.data.issuccess == 1) {
                wx.navigateBack({ a: 111 });
                return;
              }
              wx.showToast({
                title: '成功失败'
              });
            }
          );
        }
      }
    });
  },
  //前端获取美食秀秀详情
  getdata(id) {
    let { pagesize, start, shareid, list } = that.data;
    if (shareid > 0) {
      api.share(shareid, getCurrentPages()[0].route, res => {
        if (res.data.issuccess) {
          console.log(res, 'res');
        }
      });
    }

    api.getmyshowdetail(
      {
        id,
        pagesize,
        start
      },
      res => {
        if (res.data.issuccess == 1) {
          list = res.data.data;
          let {
              data,
              avatar,
              username,
              isfollow,
              isfavor,
              ts,
              favor,
              rank
            } = res.data,
            createDate = util.toCurrentDate(new Date(ts * 1000));
          that.setData({
            createDate,
            data,
            avatar,
            username,
            isfollow,
            isfavor,
            favor,
            list,
            rank,
            imgUrls: data.imgurls.split(',')
          });
        }
      }
    );
    that.getcontentslist();
  },
  prviewtap(e) {
    let { src } = e.currentTarget.dataset;
    wx.previewImage({
      urls: [src]
    });
  },
  tofollow(e) {
    console.log(e, 'eee');
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let { id } = that.data;
    let cateuserid = e.currentTarget.dataset.userid;
    if (e.currentTarget.dataset.isfollow == 0) {
      api.tofollow(cateuserid, res => {
        if (res.data.issuccess == 1) {
          that.getdata(id);
          wx.showToast({
            title: '关注成功',
            icon: 'none',
            duration: 1500
          });
        }
        wx.hideLoading();
      });
    } else {
      api.tofollow(cateuserid, res => {
        if (res.data.issuccess == 1) {
          that.getdata(id);
          wx.showToast({
            title: '取消关注',
            icon: 'none',
            duration: 1500
          });
        }
        wx.hideLoading();
      });
    }
  },
  thumbsup(e) {
    let { id } = that.data;
    let { favor } = that.data;
    console.log(favor, 'favorfavor');
    if (e.currentTarget.dataset.isfavor == 0) {
      api.give_the_thumbs_up(id, res => {
        if (res.data.issuccess == 1) {
          // wx.showToast({
          //   title: '点赞成功',
          //   icon: 'none',
          //   duration: 1500
          // })
          favor = favor + 1;
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
          favor = favor - 1;
        }
      });
    }
    that.getdata(id);
  },
  onInput(e) {
    console.log('input');
    // let {
    //   id
    // } = e.currentTarget.dataset
    // wx.navigateTo({
    //   url: '../releasecomment/releasecomment?id=' + id,
    // })
    // let {contents}=that.data
    // contents=e.detail.value
    that.setData({
      contents: e.detail.value
    });
  },
  onInputFocus() {
    this.setData({
      inputFlag: true
    });
  },
  onInputBlur() {
    setTimeout(() => {
      this.setData({
        inputFlag: false,
        contents: ''
      });
    }, 500);
  },
  /**
   * 发布
   */
  sendRemark() {
    let { contents, id } = that.data;
    if (contents == '') {
      wx.showModal({
        showCancel: !1,
        confirmColor: '#FE8F71',
        title: '提示',
        content: '请输入内容'
      });
      return;
    } else {
      wx.showLoading({
        title: '提交中',
        mask: true
      });
      api.addcontents(
        {
          cateid: id,
          contents
        },
        res => {
          wx.hideLoading();
          if (res.data.issuccess == 1) {
            that.getcontentslist();
            wx.showModal({
              showCancel: !1,
              confirmColor: '#FE8F71',
              title: '提示',
              content: '发布成功'
            });
            this.setData({
              inputFlag: false,
              contents: ''
            });
          } else if ((res.data.msg = 'wrong 包含敏感内容')) {
            wx.showToast({
              title: '您输入的评论包含敏感内容，请重新输入',
              icon: 'none'
            });
          }
        }
      );
    }
  },
  // delcontentslist(e){
  //   console.log(111)
  //     let { id , index} = e.currentTarget.dataset, {contentslist,start,pagesize } = this.data
  //     wx.showModal({
  //       title: '删除秀秀',
  //       content: '确认删除吗？',
  //       success: function(res) {
  //           // api.delCartlist({id,start,pagesize}, res => {
  //             // if (res.data.issuccess == 1) {
  //               // console.log("成功删除");
  //               // contentslist.splice(index, 1);
  //               // if (contentslist.length > 0) {
  //               //   that.setData({
  //               //     contentslist
  //               //   });
  //               // } else {
  //               // that.setData({
  //               //     contentslist: []
  //               //   });
  //               // }
  //             // }
  //           // });
  //       },
  //     })
  // },
  reportusershow(e) {
    let { id } = e.currentTarget.dataset;
    const contentslist = that.data.contentslist.slice();
    contentslist.forEach(ele => {
      ele.show = false;
      if (ele.id === id) {
        ele.show = true;
      }
    });
    that.setData({
      reportid: id,
      contentslist: [...contentslist]
    });
  },
  onDeleteUserShow(e) {
    that.setData({
      showDeleteUser: !that.showDeleteUser
    });
  },
  reportuser(e) {
    let { reportid } = that.data;
    wx.showModal({
      title: '举报',
      content: '确认举报吗？',
      confirmColor: '#FE8F71',
      success: function(res) {
        if (res.confirm) {
          api.reportuser(reportid, res => {
            if (res.data.issuccess == 1) {
              wx.showModal({
                showCancel: !1,
                title: '提示',
                confirmColor: '#FE8F71',
                content: '举报成功',
                success: function(res) {
                  that.setData({
                    reportid: 0
                  });
                }
              });
            }
          });
        }
      }
    });
  },
  isreportid() {
    that.setData({
      reportid: 0,
      showDeleteUser: false
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let { needcommentfresh } = this.data;
    if (needcommentfresh) {
      that.setData({
        needcommentfresh: !1
      });
      that.getcontentslist();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let { pagesize, start, totals } = that.data;
    start = pagesize + start;
    if (start < totals) {
      console.log('onReachBottom');
      that.setData(
        {
          start
        },
        () => {
          that.getcontentslist();
        }
      );
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: `${this.data.data.contents}`,
      imageUrl: `${headimg + this.data.imgUrls[0]}`,
      path:
        '/pages/showDetails/showDetails?share=' +
        wx.getStorageSync('user').id +
        '&i=' +
        that.data.id
    };
  }
});
