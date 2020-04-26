var that,
  api = new(require('../../utils/api.js'))(),
  app = getApp(),
  headimg = api.getimgurl(),
  util = new(require('../../utils/util.js'))(),
  tabbars = ['ALL', 'NO_PAY', 'PAYSUCCESS', 'SHIPPED', 'RECEIVED'];

function getstatecontent(state) {
  if (state == 'PAYSUCCESS') return '待发货';
  if (state == 'NO_PAY') return '待付款';
  if (state == 'CANCELED') return '已取消';
  if (state == 'SHIPPED') return '已发货';
  if (state == 'RECEIVED') return '已完成'
  if (state == 'SOLVING') return '正在处理退款';
  if (state == 'SOLVED') return '退款已处理';
  return '';
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toTime: "",
    tabindex: 0,
    showCancelModal: false,
    showLogistics: false,
    list: [],
    count: 1,
    pagesize: 4,
    start: 0,
    reachbtm: false,
    headimg,
    reasonList: [
      '质量问题',
      '卖家发错货',
      '长时间未发货',
      '描述与商品不符',
      '其他'
    ],
    resonInput: '',
    reason: '',
    ordernum: '',
    expresscompany: '',
    expressnumber: '',
    sendgoodstime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options, 'options');
    that.setData({
        tabindex: options.c || 0
      },
      () => {
        this.getlist(that.data.tabindex);
      }
    );
    let postfee = wx.getStorageSync('postfee');
    that.setData({
      postfee
    });
  },

  gettime() {
    clearInterval(this.data.toTime)
    let than = this
    let {
      list
    } = this.data;

    // 活动结束时间 单独提出来
    let endTimeList = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    list.forEach(o => {
      endTimeList.push(o.endtime)
      o.price = parseFloat(o.price / 100 + 0.01).toFixed(2)
    })
    // 执行倒计时函数
    util.countDown('countDownList', endTimeList, this)
    console.log(this.data.countDownList, "countDownList")
    this.setData({
      list
    })
  },
  tabtap(e) {
    if (this.data.tabindex != e.currentTarget.dataset.index) {
      this.setData({
        list: [],
        start: 0,
        reachbtm: false
      }, () => {
        this.getlist(e.currentTarget.dataset.index);
      })
    }
  },
  getlist(tabindex) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let {
      pagesize,
      start
    } = this.data;
    api.order_list({
        pagesize,
        start,
        state: tabindex
      },
      res => {
   
        if (res.data.issuccess == 1) {
          if (res.data.list.length > 0) {
            let {
              list
            } = this.data;
            res.data.list.forEach(x => {
              let item = x;
              item['goodsinfo'] = JSON.parse(util.decodeurl(x.goodsinfo)).data;
              item['statecontent'] = getstatecontent(x.state);
              if (item['isscore'] == 1) {
                item['totalscore'] = item.score * item.goodsinfo[0].count;
              }
              item['createDates'] = x.createDate;
              item['createDate'] = util.formatDate(new Date(x.createDate));
              list.push(item);
            });

            list.forEach((x, i) => {
              list[i].count = 0;
              x.goodsinfo.forEach((y, j) => {
                list[i].count += parseFloat(y.goodscount);
              });
            });
            console.log()
            this.setData({
              list,
              reachbtm: Math.ceil(res.data.total / this.data.pagesize) <= this.data.start + 1

            }, () => {

              this.gettime()
            });
          } else {
            this.setData({
              reachbtm: Math.ceil(res.data.total / this.data.pagesize) <= this.data.start + 1
            }, () => {
              this.gettime()
            });
          }
          this.setData({
            tabindex
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          wx.showToast({
            image: "../pic/warning.png",
            mask: true,
            title: res.data.msg
          });
        }
      }
    );
  },
  pay(e) {
    var {
      item
    } = e.currentTarget.dataset;
    api.prepay({
        ordernumber: item.ordernum
      },
      res => {
        wx.showModal({
          content: res.succ == 1 ? '支付成功' : '支付取消',
          showCancel: !1,
          confirmColor: '#FE8F71',
          success: res => {
            console.log(res, 888888888888)
            wx.reLaunch({
              url: '../orderdetail/orderdetail?ordernumber=' + item.ordernum
            });
          }
        });
      },
      () => {
        wx.showToast({
          title: '支付取消',
          icon: 'none'
        });
      }
    );
  },
  cancel(e) {
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗',
      confirmColor: '#FE8F71',
      success: res => {
        if (res.confirm) {
          let {
            ordernum
          } = e.currentTarget.dataset;
          api.cancelorder(ordernum, res => {
            if (res.data.issuccess == 1) {
              wx.showToast({
                title: '取消成功',
                mask: true,
              });
              that.getlist(that.data.tabindex);
            }
          });
        }
      }
    });
  },
  //确认收货
  finishOrder(e) {
    let {
      ordernum
    } = e.target.dataset;
    api.confirmOrder(ordernum, res => {
      if (res.data.issuccess == 1) {
        wx.showToast({
          title: '确认收货成功',
          mask: true,
          complete() {
            that.getlist(that.data.tabindex);
          }
        });

      } else {
        wx.showToast({
          title: '确认收货失败',

          mask: true,
          complete() {
            that.getlist(that.data.tabindex);
          }
        });
      }
    });
  },

  tomain() {
    wx.switchTab({
      url: '../classification/classification'
    });
  },

  todetail(e) {
    var {
      index,
      state,
      ordernumber
    } = e.currentTarget.dataset,
      params =
      state == 'SOLVING' || state == 'SOLVED' ? 'orderdetail' : 'orderdetail';
    wx.navigateTo({
      url: `../${params}/${params}?ordernumber=${ordernumber}&state=${state}`
    });
  },
  refund(e) {
    const {
      ordernum
    } = e.currentTarget.dataset;
    this.setData({
      showCancelModal: true,
      ordernum
    });
  },
  closeModal() {
    this.setData({
      showCancelModal: false
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    clearTimeout(this.data.toTime)
    if (this.data.needfresh) {
      this.getlist(this.data.tabindex);
      this.setData({
        needfresh: !1
      });
    }
  },

  resonInput(e) {
    console.log(e.detail.value);
    this.setData({
      resonInput: e.detail.value
    });
  },

  selectReason(e) {
    const {
      index
    } = e.currentTarget.dataset;
    this.setData({
      reason: this.data.reasonList[index]
    });
  },

  /**
   * 确认退款
   */
  confirmRefund() {
    const {
      reason,
      resonInput,
      ordernum
    } = this.data;
    api.applyrefund({
        number: ordernum,
        reason: reason === '其他' ? resonInput : reason
      },
      res => {
        if (res.data.issuccess === 1) {
          wx.showToast({
            title: '操作成功',
            mask: true,
            complete() {
              that.getlist(that.data.tabindex);
            }
          });

        } else {
          wx.showToast({
            image: "../pic/warning.png",
            mask: true,
            title: res.data.msg
          });
          that.getlist(that.data.tabindex);
        }
        this.setData({
          showCancelModal: false,
          resonInput: '',
          reason: ''
        });
      }
    );
  },
  /**
   * 查看物流
   */
  openLogistics(e) {
    const {
      item
    } = e.currentTarget.dataset;
    this.setData({
      showLogistics: true,
      infoData: {
        expresscompany: item.expresscompany,
        expressnumber: item.expressnumber,
        sendgoodstime: item.sendgoodstime &&
          util.formatTimenosecend(util.toTime(item.sendgoodstime))
      }
    });
  },
  closeLogistics() {
    this.setData({
      showLogistics: false
    });
  },
  bindscrolltolower: function () {
    console.log('滚动加载')
    let {
      reachbtm,
      start
    } = this.data;
    console.log(reachbtm, "滚动加载reachbtm")
    if (reachbtm) {
      console.log('滚动加载没有数据')
      return;
    }
    that.setData({
        start: start + 1,
      },
      () => {
        that.getlist(that.data.tabindex);
      }
    );
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  onUnload: function () {
    clearInterval(this.data.toTime)
  },

});