var that,
  WxParse = require('../../wxParse/wxParse.js'),
  api = new(require('../../utils/api.js')),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new(require('../../utils/util.js'));

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typesku: false, //
    selectedSku1: "", //已选sku
    selectedSku2: "", //已选sku
    ordertype: "",
    staticimg: api.getstaticimg(),
    activity: false,
    group: false, //团购标识
    userid: "",
    groupid: "",
    addressid: -1,
    showchose: !1,
    indicatorDots: true, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "#0094F3", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 2000, //间隔时间
    duration: 500, //滑动时间
    circular: true,
    detail: '', //详情
    lbimg: '', //轮播图
    price: '', //价格
    stock: 0, // 库存,
    teamprice: '', //促销价
    topimg: '',
    name: '',
    goodsunit: '',
    goodsid: '',
    list: [],
    actid: "",
    count: 1,
    goodscount: 0, // 商品数量
    totalPrice: 0, // 总价格
    goodsnum: '', //  商品编号
    id: 0,
    baseinfo: {},
    promotionprice:0,
    isscore: 'F',
    specList: [], // 规格列表
    specLists: [], //缓存规格列表
    specIndex: 0, // 一级选中规格下标
    specValue: '', // 规格名称
    specdetailid: '', //二级规格id
    specid: '', // 一级规格id
    showLogin: false,
    goodsnum: 0,
    tCountdown: "",
    detailid: "",
    groupGoods: [], //详情界面展示
    groupGoodss: [], //详情弹框界面展示
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    that = this;
    let address = wx.getStorageSync('def_address');
    let postfee = wx.getStorageSync('postfee');
    that.setData({
      postfee
    })
    if (address) {
      that.setData({
        address: address.province + address.city + address.county + address.street,
        addressid: address.id
      })
    }
    let {
      id,
      detailid
    } = that.data
    id = options.id && JSON.parse(options.id)
    console.log(options, "options")
    detailid = options.detailid && JSON.parse(options.detailid)
    if (options.group) {
      this.setData({
        group: true
      })
    }

    that.setData({
      id,
      detailid,
      actid: id
    }, () => {
      wx.setStorageSync('actid', id)

      that.getdetail()

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
  //规则
  activity() {
    this.setData({
      activity: true
    })
  },
  //搜索框
  cancelClicks() {
    this.setData({
      issearch: false
    })
  },
  detailClick() {
    this.setData({
      issearch: true
    })
  },
  //去拼团
  getAssembles(e) {
    let {
      baseinfo,
      detailid
    } = this.data
    let {
      item
    } = e.detail
    console.log(item,454545)
    let a = JSON.stringify(item.members)
    let visiblEmembers = JSON.parse(a)
    if (visiblEmembers.length < baseinfo.personlimit) {
      let EmembersLength = baseinfo.personlimit - visiblEmembers.length
      for (var i = 0; i < EmembersLength; i++) {
        visiblEmembers.push({
          avatarUrl: "../pic/grouppng.png"
        })
      }
    }
    wx.setStorageSync('userid', item.userid)
    wx.setStorageSync('groupid', item.detailid)
    this.setData({
      visible: true,
      detailid: item.detailid,
      specList:item.spec,
      visibleName: item.username,
      visiblePersonlimit: baseinfo.personlimit,
      visibleLeftperson: item.leftperson,
      visiblecomplete: baseinfo.personlimit - item.leftperson,
      visiblEmembers
    })
    // 活动结束时间 单独提出来
    let endTimeList = [];

    endTimeList.push(item.endtime)
    // 执行倒计时函数
    util.countDown('countDownList', endTimeList, this)
    console.log(this.data.countDownList, "countDownList")

  },
  //确认拼图

  goGroup(e) {
  console.log(e,11111)
    let {
      count,
      totalPrice,
      teamprice
    } = this.data
    totalPrice = (count * teamprice).toFixed(2)
    this.setData({
      group: true,
      totalPrice
    })
    this.btntap()
  },
  //去拼团弹框关闭
  handleClose() {
    console.log(3)
    this.setData({
      visible: false,
      activity: false,
      specList: this.data.specLists,
    })
  },
  getdetail() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let {
      id,
      detailid,
      iscollect
    } = that.data
    api.getgroupGoodsDetail({
      id,
      detailid
    }, res => {
      wx.hideLoading({})
      if (res.data.issuccess == 1) {
        const detailData = res.data.data
        iscollect = res.data.iscollect
        let baseinfo = detailData.baseinfo;
        const goods = detailData.goods;
        baseinfo.starttime = util.timeFormatting(baseinfo.starttime)
        baseinfo.endtime = util.timeFormatting(baseinfo.endtime)
        that.setData({
          data: detailData.goods,
          baseinfo: detailData.baseinfo,
          iscollect,
          specList: detailData.spec,
          specLists: detailData.spec,
          goodsid: goods.id,
        })
        let {
          specValue,
          specid,
          selectedSku2,
          selectedSku1,
          specdetailid
        } = that.data
        let {
          detail,
          stock,
          lbimg,
          name,
          goodsunit,
          topimg,
          promotionprice,
          goodssn,
          viewlabel,
          price
        } = detailData.goods
        let groupName = detailData.baseinfo.name
        let {
          teamprice
        } = detailData.baseinfo
        if (viewlabel) {
          api.setlabels({
            labels: viewlabel
          }, () => {})
        }
        // 判断是否有规格
        if (detailData.spec && detailData.spec.length) {
          console.log("商品有规格————-——————")
          this.setData({
            typesku: true
          })
          // 判断是否有二级规格
          if (detailData.spec[0].specInfo && detailData.spec[0].specInfo.length) {
            if (detailData.spec[0].specInfo[0].detailValue && detailData.spec[0].specInfo[0].detailValue.length) {
              // 有二级规格
              console.log("商品有二级规格————-——————")
              stock = detailData.spec[0].specInfo[0].detailValue[0].detailValueInfo[0].inventory
              const item = detailData.spec[0].specInfo[0].detailValue[0].detailValueInfo[0]
              selectedSku1 = detailData.spec[0].specInfo[0].specValueName, //已选sku
              promotionprice = (item.teamprice / 100).toFixed(2)  
                selectedSku2 = detailData.spec[0].specInfo[0].detailValue[0].detailValueInfo[0].specValueName, //已选sku
                teamprice = (item.teamprice / 100).toFixed(2)
              price = (item.price / 100).toFixed(2)
              specdetailid = item.id
              specValue = item.specValueName
            } else {
              // 无二级规格
              console.log("商品只有一级规格————-——————")
              console.log(stock, "商品只有一级规格——")
              stock = detailData.spec[0].specInfo[0].inventory
              const item = detailData.spec[0].specInfo[0]
              selectedSku2 = item.specValueName, //已选sku
              promotionprice = (item.teamprice / 100).toFixed(2)  
                teamprice = (item.teamprice / 100).toFixed(2)
              price = (item.price / 100).toFixed(2)
              specid = item.id
              specValue = ''
            }
          } else {
            // 只添加了一级规格标题，没添加规格内容
            teamprice = (teamprice / 100).toFixed(2)
            promotionprice = (promotionprice / 100).toFixed(2)
            price = (price / 100).toFixed(2)
          }
        } else {
          console.log(teamprice, "teamprice")
          console.log("商品无规格————-——————")
          promotionprice = (promotionprice / 100).toFixed(2)
          teamprice = (teamprice / 100).toFixed(2)
          price = (price / 100).toFixed(2)
        }
        detail = decodeURIComponent(detail);
        topimg = headimg + topimg
        WxParse.wxParse('article', 'html', detail, that, 5);
        let imgurlarr = lbimg.split(","),
          imgarr = [],
          newdetail = ''
        imgurlarr.map((x, i) => {
          imgarr.push(headimg + x)
        })
        that.setData({
          imgarr,
          name,
          promotionprice,
          groupName,
          teamprice,
          price,
          stock,
          selectedSku2,
          selectedSku1,
          goodsunit,
          topimg,
          goodssn,
          specid,
          specValue,
          specdetailid
        })
        api.getallgoodsactivities({
          actid: detailData.baseinfo.id,
          leadername: ""
        }, res => {
          if (res.data.issuccess == 1) {
            let newgroupGoods = res.data.data.slice(0, 3)

            this.setData({
              groupGoods: newgroupGoods,
              groupGoodss: res.data.data,

            }, () => {
              console.log(this.data.groupGoods, this.data.groupGoodss, "groupGoods")
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
        })

      }
    })
  },


  tocart() {
    this.loginModal(() => {
      wx.navigateTo({
        url: '../cart/cart',
      })
    })
  },

  checkfreight() {
    wx.navigateTo({
      url: '../freight/freight',
    })
  },
  returnClassification() {
    wx.switchTab({
      url: '../classification/classification',
    })
  },

  receivingAddress() {
    let {
      addressid
    } = this.data, url = "../address/address" + (addressid > 0 ? "?id=" + addressid : "");
    wx.navigateTo({
      url
    })
  },
  // 弹框
  choicetap() {
    this.loginModal(() => {
      let {
        count,
        totalPrice,
        promotionprice
      } = this.data
      totalPrice = (count * promotionprice).toFixed(2)
      that.setData({
        showchose: !0,
        anim: 'sizewrap 0.3s',
        totalPrice
      })
    })
  },
  // 创建拼团
  btntap(e) {
    let {
      count,
      totalPrice,
      promotionprice
    } = this.data
    totalPrice = (count * promotionprice).toFixed(2)
    this.setData({
      totalPrice
    })
    this.loginModal(() => {
      let code = e && e.currentTarget.dataset.code;

      that.setData({
        showchose: !0,
        anim: 'sizewrap 0.3s',

      })
      that.setData({
        gobuy: code == 1 ? true : false
      })
    })
  },
  closechose() {
    that.setData({
      showchose: !1,
      anim: ''
    })
  },
  counttap(e) {
    let {
      count,
      stock,
      promotionprice,
      baseinfo
    } = that.data
    let sum = Math.min(baseinfo.buymax, stock)
    if (e.currentTarget.dataset.code == 1&&sum<=count) {
      wx.showToast({
        title: '已达到库存最大值',
        image: "../pic/warning.png",
        mask: true,
      })
      return
    }
    if (e.currentTarget.dataset.code == 1) {
      count++
    } else {
      if (count > 1) {
        count--
      } else {
        wx.showToast({
          title: '至少添加一件商品',
          image: "../pic/warning.png",
          mask: true,
          duration: 2000
        })
      }
    }
console.log(count,55)
    that.setData({
      count,
      totalPrice: (promotionprice * count).toFixed(2)
    })
  },
  sizeconfirm() {
    let {
      goodsnum,
      goodssn,
      goodscount,
      count,
      promotionprice,
      gobuy,
      id,
      specIndex,
      specid,
      specdetailid,
      specList,
      stock,
      baseinfo
    } = that.data
    let sum = Math.min(baseinfo.buymax, stock)
    if (sum < 1) {
      wx.showToast({
        title: '暂无法购买',
      })
      return
    }
    let flag = false;
    const price = (promotionprice * 100).toFixed(2)
    goodsnum = goodssn
    goodscount = count
    that.setData({
      goodsnum,
      goodscount
    })
    if (specList && specList.length) {
      if (specList[0].specInfo && specList[0].specInfo.length) {
        if (specList[0].specInfo[specIndex].detailValue && specList[0].specInfo[specIndex].detailValue.length) {
          if (!specdetailid) {
            flag = true;
          }
        } else {
          // 只有一级规格， 没选规格时
          if (!specid && specIndex === index) {
            flag = true
          }
        }
      }



    }
    if (flag) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品规格',
      })
      return
    }
    if (gobuy) {
      console.log('添加购物车')
      api.addshoppingCart({
        specdetailid,
        specid,
        goodsid: id,
        goodscount,
        price,
        stock: this.data.stock
      }, res => {
        if (res.data.issuccess == 1) {
          wx.showToast({
            title: '添加成功！',
          })
        }
      })
    } else {
      console.log(price, "this.data.group")
      if (this.data.group) {
        wx.navigateTo({
          url: `../confirm/confirm?gobuy=1&promotionprice=${price}&group=true&addGroup=true`,
        })
        return
      }
      wx.navigateTo({
        url: `../confirm/confirm?gobuy=1&promotionprice=${price}&group=true`,
      })
    }

    that.setData({
      showchose: !1,
      anim: '',
    })
  },
  collectiongoods(e) {
    this.loginModal(() => {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let {
        id,
        isscore,
        actid,
        goodsid,
        iscollect
      } = that.data
      console.log(e.currentTarget.dataset.iscollect, 'eeeee')
      api.postCollection({
        userid: wx.getStorageSync('userid'),
        goodsid,
        type: '3',
        actid
      }, res => {
        // wx.hideLoading({
        //   complete: (res) => {},
        // })
        if (res.data.issuccess == 1) {
          wx.showToast({
            title: iscollect ? '取消收藏' : '收藏成功',
            icon: 'none',
            success: res => {
              that.setData({
                iscollect: !iscollect
              })
            }
          })
        }
      })
    })
  },
  toassembledetail(e) {
    let {
      id
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../assembledetail/assembledetail?id=61',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let address = that.data.address;
    if (typeof (address) == 'object') {
      that.setData({
        address: address.province + address.city + address.county + address.street
      })
    }
  },
  /**
   * 选择规格一
   */
  selectSpec(e) {
    this.setData({count:1})
    const {
      index,
      items
    } = e.currentTarget.dataset
    let {
      specList,
      count,
      totalPrice,
      stock,
      promotionprice
    } = this.data
    console.log(totalPrice,count,"totalPrice1")
    if (items.detailValue.length < 1) {
      console.log(totalPrice,"totalPrice1.5")
      stock = items.inventory,
      promotionprice=(items.teamprice/100).toFixed(2)
      // totalPrice= (count * (items.teamprice / 100)).toFixed(2)
    } else {
      console.log(totalPrice,count,"totalPrice12")
      // totalPrice= (count * (items.teamprice / 100)).toFixed(2)
      stock = items.detailValue[0].detailValueInfo[0].inventory
      promotionprice = (items.detailValue[0].detailValueInfo[0].teamprice/100).toFixed(2)
    }

    this.setData({
      promotionprice,
      totalPrice,
      selectedSku1:items.specValueName,  
      specIndex: index
    })
    if (specList[0].specInfo[index].detailValue && specList[0].specInfo[index].detailValue.length) {
      this.setData({
        specdetailid: '',
        specValue: ''
      })
    } else {
      this.setData({
        stock,
        specid: specList[0].specInfo[index].id,
        specdetailid: '',
        specValue: ''
      })
    }
  },
  /**
   * 选择规格二
   */
  selectSpecValue(e) {
    this.setData({count:1})
    const {
      index,
      items
    } = e.currentTarget.dataset

    let {
      specList,
      specIndex,
      promotionprice, //会员价
      price, //原价
      count,
      stock
    } = this.data;
    stock = items.inventory
    const item = specList[0].specInfo[specIndex].detailValue[0].detailValueInfo[index]
    console.log(item)
    this.setData({
      specid: '',
      stock,
      selectedSku2:items.specValueName,  
      specdetailid: item.id,
      specValue: item.specValueName,
      promotionprice: (item.teamprice / 100).toFixed(2),
      price: (item.price / 100).toFixed(2),
      totalPrice: (count * (item.teamprice / 100)).toFixed(2)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.data.data.name}`,
      imageUrl: `${headimg + this.data.data.topimg}`
    }
  }
})