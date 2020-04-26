// pages/VoucherCenter/VoucherCenter.js
var that,
  api = new(require('../../utils/api.js'))(),
  headimg = api.getimgurl(),
  staticimg = api.getstaticimg(),
  app = getApp(),
  util = new(require('../../utils/util.js'))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    staticimg: api.getstaticimg(),
    list: [],
    pagesize: 20,
    start: 0,
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    if (app.checkLogin()) {
      that.getCoupon().then(() => {
        //倒计时
        this.setData({
          timer: setInterval(this.setClock, 1000)
        })
      });
    } else {
      wx.switchTab({
        url: '/pages/classification/classification',
      })
    }

  },


  setClock() {
    const {
      list
    } = this.data
    list.forEach(item => {
      const temp = item.item.endDate.split('T').join(' ').replace(/-/g, '/')
      const endDate = new Date(temp).valueOf()
      const nowDate = new Date().valueOf()
      const diff = endDate - nowDate
      var days = Math.floor(diff / (24 * 3600 * 1000));
      if (days > 0) {
        item.day = days
      } else {
        //计算出小时数
        const leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        const hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        const leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000));
        const leave3 = leave2 % (60 * 1000);
        const seconds = Math.round(leave3 / 1000);
        item.hours = hours < 10 ? '0' + hours.toString() : hours
        item.mins = minutes < 10 ? '0' + minutes.toString() : minutes

        item.seconds = seconds < 10 ? '0' + seconds.toString() : seconds
        console.log(new Date(temp), nowDate)
      }

    })
    this.setData({
      list
    })
  },
  getCoupon() {
    return new Promise(resolve => {
      let {
        list,
        pagesize,
        start
      } = that.data;
      api.getCouponlist({
          pagesize,
          start
        },
        res => {
          if (res.data.issuccess == 1) {
            console.log(res.data.list, 'resres');
            list = res.data.list;
            list &&
              list.forEach(item => {
                item.recievedCount = parseInt(item.givedcount / item.couponcount * 100)
                if (item.item.type == 'MJ') {
                  item.description =
                    '全平台，满' + item.item.threshold / 100 + '元可用';
                } else {
                  item.description =
                    '全平台，最大折扣金额' + item.item.threshold / 100 + '元';
                }
              });
            that.setData({
              list
            }, () => {
              resolve(this.data.list)
            });
          }
        }
      );
    })

  },
  receivecoupon(e) {
    let {
      id,
      got
    } = e.currentTarget.dataset;
    if (got) {
      util.nocancelmodal('已经领取过', '提示');
      return;
    }
    api.receivecoupon(id, res => {
      if (res.data.issuccess == 1) {
        that.getCoupon();
        wx.showToast({
          title: '领取成功',
          mask: true,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          confirmColor: '#FE8F71',
          showCancel: !1
        });
      }
    });
  },
  onUnload() {
    console.log('sss')
    clearInterval(this.data.timer)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: `好礼送不停，优惠价更低`,
      imageUrl: `${staticimg}share_banner.png`, //图片地址
    };
  }
});