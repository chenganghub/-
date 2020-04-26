// pages/shop/confirm/confirm.js
var that,
  api = new(require("../../utils/api.js"))(),
  app = getApp(),
  imghead = api.getimgurl(),
  util = new(require("../../utils/util.js"))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupcont: "",
    group: false, //团购辨识
    addGroup: false, //加入团购标识
    score: 0,
    list: [],
    discounts: [],
    discountsIndex: 0,
    totalcount: 0,
    showreduce: 0,
    reduce: 0,
    final: 0,
    postfee: 0,
    showpostFee: 0,
    showfinal: 0,
    noaddress: !0,
    desc: "",
    selectcoupon: {
      id: -2
    },
    sendtype: 1,
    defaultaddress: "",
    address: "",
    imghead,
    show_total: 0,
    isaward: "",
    paytotal: 0,
    couponid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "options")
    that = this;
    let postfee = wx.getStorageSync("postfee");
    that.setData({
      gobuy: options.gobuy == 1,
      isscore: options.isscore == 1,
      isaward: options.isaward == 1,
      postfee,
      group: options.group == 'true',
      addGroup: options.addGroup
    });
    if (options.gobuy) {
      //立即购买
      console.log("立即购买-----------")
      let page = getCurrentPages();
      let postfee = wx.getStorageSync("postfee");
      page = page[page.length - 2];
      console.log(page, 7777777777)
      let {
        data,
        count,
        specid,
        teamprice,
        specdetailid
      } = page.data,
        total = options.promotionprice * count,
        list = [];

      console.log(page.data, '立即购买------------2');
      list.push({
        topimg: data.topimg,
        name: data.name,
        promotionprice: options.promotionprice,
        goodscount: count
      });
      if (specdetailid && specdetailid > 0) {
        console.log('立即购买-----------二级规格商品')
        that.setData({
          senddata: {
            specdetailid: specdetailid,
            goodssn: data.goodssn,
            specdetailcount: count
          }
        })
      } else if (specid && specid > 0) {
        console.log('立即购买-----------一级规格商品')
        specid = JSON.stringify([{
          id: specid,
          number: count
        }])
        that.setData({
          senddata: {
            specid,
            goodssn: data.goodssn,
          }
        })
      } else {
        console.log('立即购买-----------普通商品')
        that.setData({
          senddata: {
            goodsid: data.id,
            goodssn: data.goodssn,
            goodscount: count
          }
        })
      }
let   orderTotal=Number(Number(total / 100) + postfee / 100).toFixed(2)
      that.setData({
        list,
        teamprice,
        origintotal: total,
        total,
        postfee,
        show_total: Number(total / 100).toFixed(2),
        orderTotal,
        paytotal: ((parseFloat(total) + parseFloat(postfee)) / 100).toFixed(2)
      });
      that.getcoupon(total);
    } else if (options.isscore) {
      console.log('积分购买--------------')
      let page = getCurrentPages();
      page = page[page.length - 2];
      console.log(page, 2222)
      let {
        datas,
        score,
        size,
        size1,
        size2,
        count
      } = page.data,
        list = [];
      list.push({
        topimg: datas.topimg,
        name: datas.name,
        score,
        goodscount: count
      });
      that.setData({
        senddata: {
          score,
          goodssn: datas.goodssn,
          goodscount: count
        },
        list,
        size,
        size1,
        size2,
        total
      });
    } else if (options.isaward) {
      //抽奖赠品
      console.log('抽奖奖品------------')
      let list = [];
      api.getGoodsDetail(options.goodsid, res => {
        if (res.data.issuccess == 1) {
          console.log(res.data, "res.daddadadadad");
          list.push({
            topimg: res.data.data.topimg,
            name: res.data.data.name,
            promotionprice: 0.0,
            goodscount: 1
          });
        }
        that.setData({
          list
        });
        console.log(list, "list");
      });
    } else {
      console.log('购物车进入------------')
      var ordernumber =
        options.ordernumber == undefined ? '' : options.ordernumber,
        isscore = options.score == 1, // 积分详情
        total = options.total;
      let postfee = wx.getStorageSync('postfee');
      this.setData({
          ordernumber,
          isscore,
          origintotal: total,
          total,
          orderTotal:Number(Number(total / 100) + postfee / 100).toFixed(2),
          postfee,
          show_total: Number(total / 100).toFixed(2),
          paytotal: ((Number(total) + Number(postfee)) / 100).toFixed(2)
        },
        () => {
          this.getlist();
        }
      );
    }
  },


  getcoupon(price) {
    api.getavailablecoupon({
        price
      },
      res => {
        if (res.data.list && res.data.list.length > 0) {
          let couponnames = ["不使用优惠券"];
          this.setData({
            discounts: res.data.list
          })
          res.data.list.forEach(x => {
            console.log(x, "couponnames x")
            couponnames.push(x.name);


          });
          //判断是否是活动商品就不使用优惠券
          if (this.data.group) {
            return
          }
          that.setData({
            coupons: res.data.list,
            couponnames,
            selectcoupon: {
              id: -1,
              name: "不使用优惠券"
            }
          });
        }
      }
    );
  },
  changecoupons(e) {

    let {
      value
    } = e.detail, {
        coupons,
        origintotal
      } = that.data,
      postfee = wx.getStorageSync("postfee");


    let {
      discounts,
      orderTotal
    } = this.data
    let newdiscounts = 0
    if (value != 0) {
      newdiscounts = (discounts[value-1].price/100)
    }
   
    let orderTotalS=Number(parseFloat(orderTotal)-parseFloat(newdiscounts)).toFixed(2)
    this.setData({
      orderTotalS
    })

    if (value == 0) {
      //不选择优惠券
      const paytotal = ((Number(origintotal) + Number(postfee)) / 100).toFixed(
        2
      );
      that.setData({
        couponid: "",
        selectcoupon: {
          id: -1,
          name: "不使用优惠券"
        },
        total: origintotal,
        paytotal: Math.max(paytotal, 0).toFixed(2)
      });
      console.log(that.data.couponid);
      return;
    }

    value--;

    let couponsTotal =
      coupons[value].type === "ZK" ?
      Math.min(
        (parseFloat(origintotal) * (100 - coupons[value].percents)) / 100,
        coupons[value].threshold
      ) :
      parseFloat(coupons[value].price),
      total = parseFloat(origintotal - couponsTotal),
      paytotal = ((parseFloat(total) + parseFloat(postfee)) / 100).toFixed(2);
    that.setData({
      couponid: coupons[value].usercouponid,
      selectcoupon: coupons[value],
      paytotal: Math.max(paytotal, 0).toFixed(2),
      total
    });


  },
  toaddress() {
    wx.navigateTo({
      url: "../addressadd/addressadd"
    });
  },
  getaddress() {
    let {
      isscore
    } = this.data;
    if (isscore) {
      console.log('积分')
      api.getaddresslist(res => {
        if (res.data.issuccess == 1) {
          var {
            list
          } = res.data;
          if (list.length > 0) {
            that.setData({
              address: list[0],
              noaddress: !1,
              defaultaddress: list[0]
            });
          }
        }
      });
    } else {
      if (that.data.gobuy) {
        console.log('直接购买')
        let address = wx.getStorageSync("def_address");
        if (address) {
          that.setData({
            address,
            noaddress: !1
          });
        }
      } else {
        console.log('其他')
        let page = getCurrentPages(),
          address = page[page.length - 2].data.address;
        if (address) {
          that.setData({
            address,
            noaddress: !1,
            defaultaddress: address
          });
        }
      }
    }
  },
  inputtap(e) {
    this.setData({
      desc: e.detail.value
    });
  },
  offpay() {
    wx.navigateTo({
      url: "../order/order?c=1"
    });
  },

  tooptionaddress() {
    let {
      ordernumber,
      isscore
    } = this.data,
      addressid = this.data.address.id;
    wx.navigateTo({
      url: "../address/address?sc=" + 1 + "&&addreid=" + addressid
    });
  },
  pay(e) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    })
    let data = {};
    if (!that.data.address.id) {
      wx.showToast({
        title: "请先输入地址",
        icon: "none"
      });
      return;
    }
    if (that.data.isscore) {
      console.log('积分兑换--------------下单');
      let {
        size1,
        size2,
        size
      } = this.data
      data = that.data.senddata;
      if (size.length > 0 && size[size1].hasOwnProperty('secondValues')) {
        if (size[size1].secondValues.length > 0) {
          data["specdetailvalueid"] = size[size1].secondValues[size2].id;
        } else {
          data["specdetailid"] = size[size1].id;
        }
      } else {
        data["specdetailid"] = undefined
      }
      data["addressid"] = that.data.address.id;
      data['stock'] = that.data.stock
      api.addscoreorder(data, res => {
        if (res.data.issuccess == 1) {

          wx.showModal({
            content: "兑换成功",
            confirmColor: "#FE8F71",
            showCancel: !1,
            success: () => {
              wx.reLaunch({
                url: "../order/order"
              });
            }
          });
        } else {
          wx.showToast({
            icon: "none",
            title: res.data.msg
          });
        }
      });
    } else if (that.data.isaward) {} else {
      if (that.data.gobuy) {
        data = that.data.senddata;
        console.log(data, '立即支付------------下单')
        data['postfee'] = that.data.postfee;
        data['couponid'] = that.data.couponid;
        data['addressid'] = that.data.address.id;
        data['stock'] = that.data.stock
      } else {
        let page = getCurrentPages();
        page = page[page.length - 2];
        console.log('购物车进入支付-------下单')
        data = page.data.addorderdata;
        data["postfee"] = that.data.postfee;
        data["addressid"] = that.data.address.id;
        data["couponid"] = that.data.couponid;
        data['stock'] = that.data.stock
      }
      let page = getCurrentPages();
      page = page[page.length - 2];
      console.log(page.data.count, "pagepagepa111111gepage")
      //正式
      //判断是否是活动商品就不使用优惠券
      console.log(this.data.addGroup)
      let ajax = api.addorder
      if (this.data.group && !this.data.addGroup) {
        data['actid'] = page.data.actid
        data['userid'] = ""
        data['goodscount'] = page.data.count
        data['specdetailvalueid'] = data.specdetailid
        data['specdetailid'] = data.specid
        ajax = api.groupgoods
      } else if (this.data.addGroup) {
        data['detailid'] = page.data.detailid
        data['userid'] = wx.getStorageSync('userid')
        data['actid'] = page.data.actid
        data['goodscount'] = page.data.count
        data['specdetailvalueid'] = data.specdetailid
        data['specdetailid'] = data.specid
        ajax = api.addmember
      }

      ajax(data, res => {
        if (res.data.issuccess == 1) {

          if (this.data.paytotal === 0) {
            console.log('0元订单支付——————————————————————')
            res.data.ordernum && api.freepay(res.data.ordernum, resp => {
              if (resp.data.issuccess === 1) {

                wx.showModal({
                  content: "支付成功",
                  confirmColor: "#FE8F71",
                  showCancel: !1,
                  success: () => {

                    if (this.data.group && resp.succ != 1) {
                      wx.showToast({
                        title: '活动创建失败',
                        image: "../pic/warning.png",
                      })
                      return
                    }
                    wx.reLaunch({
                      url: `../orderdetail/orderdetail?ordernumber=${res.data.ordernum}&state=PAYSUCCESS`
                    });
                  }
                });
              }
            });
          } else {
            console.log('大于0元订单支付——————————————————————')
            api.prepay({
                ordernumber: res.data.ordernum
              },
              resp => {
                console.log("prepay", resp);
                wx.showModal({
                  confirmColor: "#FE8F71",
                  content: resp.succ == 1 ? "支付成功" : "支付取消",
                  showCancel: !1,
                  success: () => {
                    if (this.data.group && resp.succ != 1) {
                      wx.showToast({
                        title: '活动创建失败',
                        image: "../pic/warning.png",
                      })
                      return
                    }
                    wx.reLaunch({
                      url: `../orderdetail/orderdetail?ordernumber=${res.data.ordernum}&state=PAYSUCCESS`
                    });
                  }
                });
              }
            );
          }
        }else{
          wx.showToast({
            icon: "none",
            title: res.data.msg
          });
        }
      });
    }
    wx.hideLoading({})
  },
  scorepay() {},
  getlist() {
    var page = getCurrentPages(),
      {
        isscore
      } = this.data,
      list = [],
      total = 0,
      goodsid = [],
      specdetailid = [],
      cartids = [];
    page = page[page.length - 2];

    //从积分商品详情跳转
    if (isscore) {
      list[0] = page.data.selectitem;
      total += list[0].count * list[0].score;
    } else {
      //如果是从购物车跳转 或商品详情跳转
      console.log(page.data.list)
      page.data.list.forEach((x, i) => {
        if (x.check == 1) {
          cartids.push(x.id);
          list.push(x);
          total += x.count * x.price;
        }
      });
    }
    let sendtype = page.data.sendtype;
    that.getcoupon(page.data.total);
    that.setData({
      list,
      cartids,
      sendtype
    });
  },
  chosesend(e) {
    let {
      sendtype
    } = e.target.dataset, {
      defaultaddress
    } = this.data;
    if (sendtype == 2) {
      this.setData({
        address: "",
        noaddress: !0
      });
    } else {
      if (defaultaddress != "")
        this.setData({
          address: defaultaddress,
          noaddress: !1
        });
    }
    this.setData({
      sendtype
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.needgetaddress) {
      console.log('不需要地址')
      let address = this.data.address;
      if (address) {
        this.setData({
          address,
          defaultaddress: address,
          needgetaddress: !1,
          noaddress: !1
        });
      }
    } else {
      console.log('选择地址')
      // this.getaddress();
      let address = wx.getStorageSync("def_address");
      if (address) {
        that.setData({
          address,
          noaddress: !1
        });
      }
    }
  }
});