var that,
  qrcode = require('../../utils/wxqrcode.js'),
  wxbarcode = require('../../utils/wxbarcode.js'),
  api = new(require('../../utils/api.js'))(),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new(require('../../utils/util.js'))();

function getgoodstype(state) {
  if (state == 'PAYSUCCESS') return '待发货商品';
  if (state == 'NO_PAY') return '未支付商品';
  if (state == 'CANCELED') return '已取消商品';
  if (state == 'SHIPPED') return '已发货商品';
  if (state == 'RECEIVED') return '已完成商品';
  if (state == 'SOLVING') return '正在处理退款';
  if (state == 'SOLVED') return '退款已处理商品';
  return '';
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reasonList: [
      '质量问题',
      '卖家发错货',
      '长时间未发货',
      '描述与商品不符',
      '其他'
    ],
    showCancelModal: false,
    headimg,
    ordertype: "",
    staticimg: api.getstaticimg(),
    text: '',
    target: {
      rreturnPrice: "0"
    },
    qrcodeimg: '',
    address: '',
    noaddress: !0,
    resonInput: '',
    ordernum: "",
    showLogistics: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      state: options.state,
      ordernumber: options.ordernumber
    });
    this.getorderdetail(options.ordernumber);
  },
  selectReason(e) {
    const {
      index
    } = e.currentTarget.dataset;
    this.setData({
      reason: this.data.reasonList[index]
    });
  },
  closeModal() {
    this.setData({
      showCancelModal: false
    });
  },
  refund(e) {
    this.setData({
      showCancelModal: true,

    });
  },
  //确认收货
  finishOrder() {

    api.confirmOrder(this.options.ordernumber, res => {
      if (res.data.issuccess == 1) {
        wx.showToast({
          title: '确认收货成功',
          mask: true,
          complete() {
            wx.reLaunch({
              url: `/pages/order/order?c=3`,
            })
          }
        });

      } else {
        wx.showToast({
          title: '确认收货失败',

          mask: true,
          complete() {
            wx.reLaunch({
              url: `/pages/order/order?c=3`,
            })
          }
        });
      }
    });
  },
  /**
   * 确认退款
   */
  confirmRefund() {
    const {
      reason,
      resonInput,
      ordernumber
    } = this.data;
    api.applyrefund({
        number: ordernumber,
        reason: reason === '其他' ? resonInput : reason
      },
      res => {
        if (res.data.issuccess === 1) {
          wx.showToast({
            title: '操作成功',
            mask: true,
            complete() {
              wx.navigateBack({

              })
            }
          });

        } else {
          wx.showToast({
            image: "../pic/warning.png",
            mask: true,
            title: res.data.msg
          });
          this.setData({
            showCancelModal: false,
          })
        }
        this.setData({
          showCancelModal: false,
          resonInput: '',
          reason: ''
        });
      }
    );
  },
  addcart(e) {
    var {
      target
    } = this.data, {
      id,
      index
    } = e.currentTarget.dataset;
    target.goodsinfo[index]['describe'] = target.goodsinfo[index].desc;
    //  wx.removeStorageSync("cart");
    var cart = wx.getStorageSync('cart');
    var flag = true;
    if (cart.length > 0) {
      cart.map((x, i) => {
        if (x.id == id) {
          wx.showToast({
            title: '成功添加到购物车',
            duration: 1000
          });
          x.count++;
          wx.setStorageSync('cart', cart);
          flag = false;
          return;
        }
      });
      if (flag) {
        wx.showToast({
          title: '成功添加到购物车',
          duration: 1000
        });
        cart.push(target.goodsinfo[index]);
        wx.setStorageSync('cart', cart);
      }
    } else {
      // return;
      wx.showToast({
        title: '成功添加到购物车',
        duration: 1000
      });
      cart = [];

      target.goodsinfo[index]['count'] = 1;
      cart.push(target.goodsinfo[index]);
      wx.setStorageSync('cart', cart);
    }
  },
  bcode(cb) {
    let {
      ordernumber
    } = this.data;
    wx.getSystemInfo({
      success: function (res) {
        wxbarcode.barcode('bcode', ordernumber, 580, 150, {
          succ: function createimg() {
            console.log('回调');
            let {
              canvas_id
            } = that.data;
            wx.canvasToTempFilePath({
              canvasId: 'bcode',
              success: function (res) {
                var barimg = res.tempFilePath;
                console.log(barimg, 'barimg', 'aaa');
                that.setData({
                  barimg
                });
              },
              fail: function (res) {
                console.log(res);
                wx.showModal({
                  title: '提示',
                  confirmColor: '#FE8F71',
                  content: res
                });
              }
            });
          }
        });
      }
    });
  },
  prebarcode() {
    wx.canvasToTempFilePath({
      canvasId: 'bcode',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        wx.previewImage({
          current: tempFilePath, // 当前显示图片的http链接
          urls: [tempFilePath] // 需要预览的图片http链接列表
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  getorderdetail(ordernumber) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    api.getorderdetail(ordernumber, res => {
      if (res.data.issuccess == 1) {
        let target = res.data.data,
          coupon = res.data.coupon,
          address = target.address;
        target.goodsinfo = JSON.parse(target.goodsinfo)
        //区分商品类型
        let type = "promotionprice"
        switch (target.ordertype) {
          case '2':
            type = 'score'
            break;
          case '3':
            type = 'teamprice'
            break;
        }
        //按后端需求按需计算数据
        let totalprices = target.goodsinfo && target.goodsinfo.data.reduce((pro, cur) => {
          return pro + cur[type] * cur.goodscount
        }, 0)
        target.price = Number((totalprices / 100).toFixed(2))
        target.postfee = Number((target.postfee) / 100).toFixed(2)
        target.couponprice = Number((target.couponprice / 100).toFixed(2))
        // target.totalPrice = Number(target.goodsinfo.data[0][type]) + Number(target.postfee) - Number(target.couponprice)
        target.returnPrice = Number(target.price + Number(target.postfee) - target.couponprice).toFixed(2)

        if (type == 'score') {
          target.returnPrice = Number(target[type])
        }
        if (target.refundtime) {
          target.refundtime = util.timeFormatting(target.refundtime)
        }
        if (address) {
          this.setData({
            noaddress: !1
          });
        }
        if (coupon) {
          this.setData({
            coupon
          });
        }

        this.setData({
            ordernumber: target.ordernum,
            target,
            ordertype: target.ordertype,
            address,
            infoData: {
              expresscompany: target.expresscompany,
              expressnumber: target.expressnumber,
              sendgoodstime: target.sendgoodstime &&
                util.formatTimenosecend(util.toTime(target.sendgoodstime))
            }
          },
          () => {
            this.getdata(target);
          }
        );
      }
    });
  },
  //适配不同屏幕大小的canvas
  getQRCodeSize() {
    var size = 0;
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 278; //不同屏幕下QRcode的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      size = width;
    } catch (e) {
      // Do something when catch error
      // console.log("获取设备信息失败"+e);
    }
    return size;
  },

  createQRCode(text, size) {
    //调用插件中的draw方法，绘制二维码图片
    let that = this;
    let _img = qrcode.createQrCodeImg(text, {
      size: parseInt(size)
    });

    that.setData({
      qrcodeimg: _img
    });
  },
  precode(e) {
    let {
      qrcodeimg,
      barimg
    } = this.data, {
      imgsrc
    } = e.target.dataset;
    wx.previewImage({
      urls: [barimg, qrcodeimg],
      current: imgsrc
    });
  },

  toaddress() {
    wx.navigateTo({
      url: '../addressadd/addressadd'
    });
  },
  tooptionaddress() {
    let {
      orderNumber
    } = this.data.target,
      addressid = this.data.address.id;
    wx.navigateTo({
      url: '../address/address?o=' + orderNumber + '&&addreid=' + addressid
    });
  },
  getdata(target) {
    // let page = getCurrentPages();
    // page = page[page.length - 2];
    let goodstype = getgoodstype(target.state),
      ordertime = util.formatTime(new Date(target.createDate)),
      paytime = util.formatTime(new Date(target.paytime)),
      totalscore =
      target.isscore == 1 ?
      target.goodsinfo.count * target.score :
      target.score;
    // target.goodsinfo = JSON.parse(util.decodeurl(target.goodsinfo));
    target.teamprice = (Number(target.goodsinfo.data[0].teamprice / 100)).toFixed(2)
    // if (target.couponid > 0) {
    //   api.getcouponbyid(target.couponid, res => {
    //     if (res.data.issuccess == 1) {
    //       that.setData({ coupon: res.data.coupon })

    //     }
    //   })
    // }
    // console.log() =='01-01-01 00:00:00','time')
    // target.goodsinfo.forEach(x=>{
    // })

    if (target.describe == 'undefined') target.describe = '无';
    this.setData({
        target,
        goodstype,
        ordertime,
        paytime,
        totalscore
      },
      res => {
        wx.hideLoading();
      }
    );
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: '13717727768'
    });
  },
  getaddress() {
    // var {addressid} = this.data.target;
    // var address = wx.getStorageSync('address'), index = 0;
    // console.log(address);
    // if (address.length > 0) {
    //   address.map((x, i) => {
    //     if (x.check == 1) {
    //       index = i;
    //     }
    //   });
    //   console.log(index, "index");
    //
    // }
    // api.getaddressbyid(addressid,res=>{
    //   if(res.data.issuccess){
    //     that.setData({ address: res.data.data, noaddress: !1 },()=>{
    //     })
    //   }
    // });
  },
  todetail(e) {
    console.log(e, 111)
    let {
      goodsitem,

      ordertype,

    } = e.currentTarget.dataset
    console.log(goodsitem, "goodsitem")
    let title = '商品'
    if (goodsitem.state == '1') {
      if (ordertype == '3') {
        title = "活动"
      }
      wx.showToast({
        title: `${title}已下架`,
      })
      return
    }

    switch (ordertype) {
      case '1':
        wx.navigateTo({
          url: '/pages/goodsDetail/goodsDetail?id=' + goodsitem.id
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../integraldetails/integraldetails?id=' + goodsitem.id,
        })
        break;
      case '3':
        wx.navigateTo({
          url: '/pages/assemble/assemble?id=' + goodsitem.actid,
        })
        break;
    }

  },
  tomain() {
    wx.switchTab({
      url: '../classification/classification'
    });
  },
  cancel() {
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗',
      confirmColor: '#FE8F71',
      success: res => {
        if (res.confirm) {
          api.cancelorder(that.data.ordernumber, result => {
            if (result.data.issuccess == 1) {
              wx.showToast({
                title: '取消成功'
              });
              // var page = getCurrentPages();
              // page = page[page.length - 2];
              // console.log(page)
              // page.setData({
              //   needfresh: !0
              // });
              wx.navigateTo({
                url: '/pages/order/order',
              })
            }
          });
        }
      }
    });
  },
  pay() {
    var {
      ordernumber
    } = this.data;
    wx.showLoading({
      title: '支付中',
      mask: true
    });
    api.prepay({
        ordernumber
      },
      res => {
        if (res.succ == 1) {
          //支付成功
          var page = getCurrentPages();
          page = page[page.length - 2];
          page.setData({
            needfresh: !0
          });
          wx.navigateBack();
        } else {
          wx.showToast({
            title: '支付取消',
            icon: 'none'
          });
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let address = this.data.address;

    if (address.id != 0 && address) {
      this.setData({
        noaddress: !1
      });
    }
    // if (this.data.needgetaddress) {
    //   let address = this.data.address;
    //   if (address) {
    //     this.setData({ address, needgetaddress: !1, noaddress: !1 });
    //   }
    // } else {
    //   this.getaddress();
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    let {
      ordernumber
    } = this.data;
    this.getorderdetail(ordernumber);
    this.createQRCode(this.data.ordernumber, 400);
    this.bcode();
  },
  openLogistics() {
    this.setData({
      showLogistics: true
    });
  },
  closeLogistics() {
    this.setData({
      showLogistics: false
    });
  }
});