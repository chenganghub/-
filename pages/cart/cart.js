// pages/shop/cart/cart.js
var that,
  api = new(require('../../utils/api.js'))(),
  app = getApp(),
  headimg = api.getimgurl(),
  util = new(require('../../utils/util.js'))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headimg,
    nolist: !0,
    show_totalcount: 0,
    total: 0,
    getall: 0,
    Listlength:0,
    switcharr: [],
    list: [],
    inputvalue: '',
    totalnumber: 0,
    noaddress: !0,
    sendtype: 1,
    start: 0,
    pagesize: 20,
    // cartlist:[],
    topimage: '',
    imglist: [],
    price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let address = wx.getStorageSync('def_address');
    if (address) {
      that.setData({
        address,
        noaddress: !1
      });
    }
    let {
      start,
      pagesize,
      topimage,
      imglist,
      price
    } = that.data;
    api.getCartlist({}, res => {
      if (res.data.issuccess == 1) {
        let list = [];
        res.data.list.forEach((x, i) => {
          x.check = 0;
          list.push(x);
          // topimage = headimg + x.info.topimg
          // price = (x.info.price / 100).toFixed(2);
          // imglist.push(topimage)
          // list.push(x)
        });
        that.setData({
          list,
          Listlength:  res.data.list.length
        });
      }
    });
  },
  //删除
  deleteAll() {
    let than = this
    let {
      switcharr,
      list
    } = this.data;
    switcharr.length < 1 && wx.showToast({
      title: '请选择商品',
      mask: true,
    })
    switcharr.length >= 1 && wx.showModal({
      title: '删除商品',
      confirmColor: '#FE8F71',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          let ids = []
          switcharr.forEach(item => {
            ids.push(list[item].id)
          })
          api.deleteAll({
            ids: JSON.stringify(ids)
          }, res => {

            wx.showToast({
              title: res.data.msg,
            })
            than.onLoad()
          })

        }
      }
    })
  },
  tomain() {
    wx.switchTab({
      url: '../classification/classification'
    });
  },

  tosearch() {
    var {
      inputvalue
    } = this.data;
    if (inputvalue.length == 0) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '../search/search?k=' + this.data.inputvalue
    });
  },
  searchinput(e) {
    this.setData({
      inputvalue: e.detail.value
    });
  },
  getlist(cart) {
    var show_totalcount = '',
      totalcount = 0,
      totalnumber = 0,
      {
        switcharr
      } = this.data;
    if (cart.length > 0) {
      cart.map((x, i) => {
        cart[i]['check'] = switcharr.indexOf(i) > -1 ? 1 : 0;
        totalcount += parseFloat(cart[i]['promotionprice']) * x.goodscount;
        show_totalcount = (totalcount / 100).toFixed(2);
      });
      that.setData({
        nolist: !1,
        list: cart,
        totalcount,
        show_totalcount,
        getall: switcharr.length == cart.length && switcharr.length != 0 ? 1 : 0
      });
    } else {
      this.setData({
        list: [],
        nolist: !0
      });
    }
    this.counttotal();
  },

  counttap(e) {
    //totalnumber  共计数
    //show_totalcount 总计金额
    let {
      code,
      item
    } = e.currentTarget.dataset, {
      list,
      totalcount
    } = this.data;
    if (code == 1 && item.stock <= item.goodscount) {
      console.log(code)
      wx.showToast({
        title: '已达到库存最大值',
        image: "../pic/warning.png",
        mask: true,
      })
      return
    }
    api.setCartcount({
        id: item.id,
        count: code == 0 ? parseFloat(item.goodscount) - 1 : parseFloat(item.goodscount) + 1
      },
      res => {
        if (res.data.issuccess == 1) {
          that.getlist(res.data.list);
          this.setData({Listlength:res.data.list.length})
          //处理list
          // if (item.check === 1) {
          //   that.getlist(res.data.list);

          // }

        }
      }
    );

    // var {
    //   code,
    //   index
    // } = e.currentTarget.dataset, {
    //   list,
    //   totalcount
    //   } = this.data, show_totalcount = '', price = Number(list[index]['promotionprice']);
    // if (code == 0) { //减低库存
    //   if (list[index].goodscount == 1) { //库存为1，则删掉该记录
    //     list.splice(index, 1)
    //   } else {
    //     list[index].goodscount = list[index].goodscount - 1;
    //   }
    //   totalcount = totalcount - price
    //   show_totalcount = (totalcount / 100).toFixed(2);

    // } else {
    //   if (list[index].goodscount == list[index].limit) return;
    //   list[index].goodscount = list[index].goodscount + 1
    //   totalcount = totalcount + price
    //   show_totalcount = (totalcount / 100).toFixed(2)
    // }
    // // app.badege(list);
    // console.log(show_totalcount,'show_totalcount')
    // console.log(totalcount,'totalcount')

    // this.counttotal()
    // this.setData({
    //   list,
    //   totalcount,
    //   show_totalcount
    // })
  },

  todetail(e) {
    let {
      goodsid,
      flag,
      state,
    } = e.currentTarget.dataset.idx;
    let title = '';
    if (flag == '1') {
      flag = false;
      title = '商品已删除'
    } else if (state == '1') {
      state = false;
      title = '商品已下架'
    }
    wx.showToast({
      title: title,
    })
    flag && state && wx.navigateTo({
      url: '/pages/goodsDetail/goodsDetail?id=' + goodsid
    });
  },
  getchecklist(cart) {
    let {
      isscore
    } = this.data,
      checklist = [],
      total = 0,
      cartids = [];
    cart.forEach((x, i) => {
      if (x.check == 1) {
        cartids.push(x.id);
        checklist.push(x);
        total += x.goodscount * x.price;
      }
    });
    if (!isscore) {
      // that.getcoupon(total);
    }
    that.setData({
      checklist,
      total,
      cartids,
      origintotal: total
    });
  },
  //删除商品
  delcarlist(e) {
    let {
      id,
      index,
      check
    } = e.currentTarget.dataset, {
        list,
        start,
        pagesize
      } = this.data,
      openid = wx.getStorageSync('openid');
    console.log('check', check);
    wx.showModal({
      title: '删除商品',
      confirmColor: '#FE8F71',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          api.delCartlist({
              ids: id,
              start,
              pagesize
            },
            res => {
              if (res.data.issuccess == 1) {
                if (check == 1) {
                  let {
                    switcharr
                  } = that.data;
                  switcharr.splice(index, 1);
                  that.setData({
                    switcharr
                  });
                }
                that.getlist(res.data.list);
                // console.log("成功删除");
                // list.splice(index, 1);
                // if (list.length > 0) {
                //   that.setData({
                //     list
                //   });
                // } else {
                // that.setData({
                //     list: []
                //   });
                // }
              }
            }
          );
        }
      }
    });
  },
  toconfirm() {
    var userinfo = wx.getStorageSync('user'),
      {
        list,
        switcharr,
        totalnumber
      } = this.data;

    let filters = switcharr.filter(item => {
      return list[item].state == '1' || list[item].flag == '1'
    })
    console.log(filters, filters, "filters")
    if (filters.length > 0) {
      wx.showToast({
        title: '存在已下架或已删除商品',
      })
      return
    }
    if (totalnumber <= 0) {
      wx.showModal({
        title: '提示',
        confirmColor: '#FE8F71',
        content: '还没有选中任何商品哦~',
        showCancel: !1
      });
      return;
    }
    if (!userinfo) {
      wx.showModal({
        title: '提示',
        confirmColor: '#FE8F71',
        content: '请先登录，再提交订单',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../mine/mine'
            });
          }
        }
      });
      return;
    }
    var {
      switcharr,
      list,
      address
    } = this.data,
      goodssn = [],
      goodscount = [],
      goodsid = [],
      specdetailid = [],
      specdetailcount = [],
      specid = [],
      cartids = [];
    switcharr.forEach(x => {
      goodssn.push(list[x]['goodsnum']);
      cartids.push(list[x].id);
      if (list[x].specdetailid && list[x].specdetailid > 0) {
        // 二级规格
        specdetailid.push(list[x].specdetailid);
        specdetailcount.push(list[x]['goodscount'])
      } else if (list[x].specid && list[x].specid > 0) {
        // 一级规格
        specid.push({
          id: list[x].specid,
          number: list[x].goodscount
        })
      } else {
        goodsid.push(list[x].goodsid);
        goodscount.push(list[x]['goodscount']);
      }
    });
    that.setData({
        addorderdata: {
          specid: JSON.stringify(specid),
          goodssn: goodssn.join(','),
          goodscount: goodscount.join(','),
          specdetailcount: specdetailcount.join(','),
          cartids: cartids.join(','),
          specdetailid: specdetailid.join(','),
          goodsid: goodsid.join(',')
        }
      },
      () => {
        wx.navigateTo({
          url: '../confirm/confirm?total=' + that.data.total
        });
      }
    );
  },
  //全选
  getall() {
    var {
      getall,
      list
    } = this.data;
    getall = getall == 1 ? 0 : 1;
    list.map((x, i) => {
      list[i]['check'] = getall;
    });
    this.setData({
        list,
        getall
      },
      () => {
        this.counttotal();
      }
    );
  },
  //单选
  switchtap(e) {
    let {
      check,
      index,
      item
    } = e.currentTarget.dataset, {
      list,
      selects,
      totalcount,
      switcharr
    } = this.data;
    let than = this
    if (item.flag == '1' || item.state == '1') {
      check == 0 && wx.showModal({
        title: '提示',
        content: '商品已下架是否选择',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log(check, 11)
            check == 0 && (list[index].check = check == 0 ? 1 : 0)
            // 反向全选状态
            for (let i = 0; i < list.length; i++) {
              const item = list[i]
              if (item.check === 0) {
                than.setData({
                  getall: 0
                })
                break
              } else {
                than.setData({
                  getall: 1
                })
              }
            }
            than.counttotal();
            than.setData({
              list,
              // getall: 0
            });
          } else {
            console.log('用户点击取消')
            return
          }
        }
      })
    }
    list[index].check = check == 0 ? 1 : 0
    // 反向全选状态
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.check === 0) {
        than.setData({
          getall: 0
        })
        break
      } else {
        than.setData({
          getall: 1
        })
      }
    }
    than.counttotal();
    than.setData({
      list,
      // getall: 0
    });

  },

  //计算总价
  counttotal() {
    var {
      list
    } = this.data,
      total = 0,
      switcharr = [],
      totalnumber = 0,
      show_totalcount = 0;
    list.forEach((x, i) => {
      console.log(x)
      if (x.check == 1) {
        switcharr.push(i);
        total += parseFloat(x.promotionprice) * parseFloat(x.goodscount);
        totalnumber += parseFloat(x.goodscount);
      }
    });
    show_totalcount = (total / 100).toFixed(2);
    this.setData({
      total,
      switcharr,
      totalnumber,
      show_totalcount
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  getpricebycodes(cart) {
    if (cart.length < 1) {
      this.setData({
        list: [],
        nolist: !0
      });
      this.counttotal();
      return;
    }
    var codes = [];
    cart.forEach((x, i) => {
      codes.push(x.code);
    });
    codes = codes.join(',');
    // api.getpricebycodes(codes, res => {
    //   if (res.data.issuccess == 1) {
    //     cart.forEach((x, i) => {
    //       res.data.price.forEach((x, i) => {
    //         if (cart[i].id == x.id) cart[i].price = x.price;
    //       });
    //     })

    //     wx.setStorageSync('cart', cart);
    //     this.getlist(cart);
    //   } else {

    //     this.getlist(cart);
    //   }
    // });
  }
});