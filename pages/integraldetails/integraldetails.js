// pages/goodsDetail/goodsDetail.js

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
    score: 0,
    size1: 0,
    size2: 0,
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
    promotionprice: '', //促销价
    topimg: '',
    name: '',
    goodsunit: '',
    list: [],
    count: 1,
    goodscount: 0, // 商品数量
    price: 0, // 总价格
    goodsnum: '', //  商品编号
    datas: "",
    size: [],
    showLogin: false,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    that = this;
    let address = wx.getStorageSync('def_address');
    if (address) {
      that.setData({
        address: address.province + address.city + address.county + address.street,
        addressid: address.id
      })
    }
    let {
      id
    } = that.data
    id = options.id
    that.setData({
      id
    }, () => {
      that.getdetail()
    })

  },
  /**
   * 点击规格1
   * */
  selecSizeOne(e) {
    this.setData({
      count: 1
    })
    let {
      promotionprice,
      count
    } = this.data
    let {
      item
    } = e.currentTarget.dataset
    console.log(item, 222)
    if (item.secondValues && item.secondValues.length < 1) {
      this.setData({
        promotionprice: item.score,
        selectedSku1: item.specValueName,
        stock: item.inventory,
        size1: e.currentTarget.dataset.index,
        score: (count * (item.score))
      })
    } else {
      this.setData({
        count,
        selectedSku1: item.specValueName,
        size1: e.currentTarget.dataset.index,
        score: parseFloat(item.secondValues[this.data.size2].score) * count,
        promotionprice: parseFloat(item.secondValues[this.data.size2].score),
        stock: item.secondValues[this.data.size2].inventory
      })
    }


  },
  selecSizeTwo(e) {
    this.setData({
      count: 1
    })
    let {
      promotionprice,
      count
    } = this.data
    let {
      item
    } = e.currentTarget.dataset
    this.setData({
      count,
      selectedSku2: item.specValueName,
      size2: e.currentTarget.dataset.index,
      // score: item.score,
      score: Number(item.score) * count,
      promotionprice: Number(item.score),
      stock: item.inventory,
    })

  },
  getdetail() {
    let {
      id,
      selectedSku1,
      selectedSku2,
      iscollect
    } = that.data
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    api.getscoregoodsdetails(id, res => {
      wx.hideLoading({})
      console.log('res', res)
      if (res.data.issuccess == 1) {
        let score = 0,
          promotionprice = 0,
          stock = 0;
        try {
          if (res.data.data.spec.length > 0) { //有规格
            this.setData({
              typesku: true
            })
            if (res.data.data.spec[0].secondValues.length > 0) { //多个规格
              stock = res.data.data.spec[0].secondValues[0].inventory
              score = res.data.data.spec[0].secondValues[0].score
              console.log(res.data.data.spec)
              selectedSku1 = res.data.data.spec[0].specValueName, //已选sku
                selectedSku2 = res.data.data.spec[0].secondValues[0].specValueName, //已选sku

                promotionprice = res.data.data.spec[0].secondValues[0].score
            } else { //一个规格
              stock = res.data.data.spec[0].inventory
              selectedSku1 = res.data.data.spec[0].specValueName //已选sku
              score = res.data.data.spec[0].score
              promotionprice = res.data.data.spec[0].score
            }
          } else {
            score = res.data.data.scoregoods.score
            promotionprice = res.data.data.scoregoods.score
            stock = res.data.data.scoregoods.stock
            console.log(stock, "stock")
          }
          iscollect = res.data.iscollect
          that.setData({
            datas: res.data.data.scoregoods,
            size: res.data.data.spec,
            score,
            selectedSku1,
            selectedSku2,
            promotionprice,
            stock,
            iscollect
          }, () => {
            let {
              lbimg,
              name,
              goodsunit,
              topimg,
              goodssn,
              detail,
            } = that.data.datas
            detail = decodeURIComponent(detail);
            topimg = headimg + topimg
            WxParse.wxParse('article', 'html', detail, that, 5);
            console.log(lbimg, "lbimg")
            let imgurlarr = lbimg.split(","),
              imgarr = [],
              newdetail = ''
            imgurlarr.map((x, i) => {
              imgarr.push(headimg + x)
            })
            that.setData({
              imgarr,
              name,
              goodsunit,
              topimg,
              goodssn
            })
          })
        } catch (e) {
          console.error(e)
        }


      }

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
  collectiongoods(e) {
    this.loginModal(() => {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      let {
        id,
        isscore,
        iscollect
      } = that.data
      api.postCollection({
        userid: wx.getStorageSync('userid'),
        goodsid: id,
        type: '2',
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

  tocart() {
    wx.navigateTo({
      url: '../cart/cart',
    })
  },
  // replaceraw(content) {
  //                   return  content.replace('rgb(', 'rgb').replace(new  RegExp('rgb', 'g'), "rgb(");
  //             },

  checkfreight() {
    wx.navigateTo({
      url: '../freight/freight',
    })
  },
  returnClassification() {
    console.log(111)
    wx.switchTab({
      url: '../classification/classification',
    })
  },
  returnIndex() {
    console.log(111)
    wx.switchTab({
      url: '../index/index',
    })
  },
  receivingAddress() {
    console.log(111)
    let {
      addressid
    } = this.data, url = "../address/address" + (addressid > 0 ? "?id=" + addressid : "");
    wx.navigateTo({
      url
    })
  },
  choicetap() {
    this.loginModal(() => {
      that.setData({
        showchose: !0,
        anim: 'sizewrap 0.3s'
      })
    })
  },
  btntap(e) {
    this.loginModal(() => {
      console.log(e, 'eeee')
      let code = e.currentTarget.dataset.code,
        {
          goodsnum,
          goodssn,
          goodscount,
          count,
          price,
          promotionprice
        } = that.data
      price = count * promotionprice
      that.setData({
        showchose: !0,
        anim: 'sizewrap 0.3s',
        price
      })
      if (code == 1) {

        // api.addshoppingCart({ goodsnum: goodssn, goodscount: count, price},res=>{
        //   if (res.data.issuccess == 1) {
        //     console.log(1)
        //   }
        // })
      }
    })
  },
  closechose() {
    that.setData({
      showchose: !1,
      anim: ''
    })
  },
  counttap(e) {
    console.log(e, 'e')
    let {
      count,
      stock,
    } = that.data
    if (e.currentTarget.dataset.code == 1) {
      count++
    } else {
      if (count > 1) {
        count--
      } else {
        wx.showToast({
          title: '至少添加一件商品',
          icon: 'none',
          duration: 2000
        })
      }
    }
    if (stock < count) {
      wx.showToast({
        title: '已达到库存最大值',
        image: "../pic/warning.png",
        mask: true,
      })
      return
    }
    that.setData({
      count
    })
  },
  sizeconfirm() {
    if (this.data.stock < 1) {
      wx.showToast({
        title: '库存为0不能购买',
        image: "../pic/warning.png",
        mask: true,
      })
      return
    }
    let {
      data,
      count
    } = this.data, id = this.data.id;
    api.canbuy(id, count, res => {
      if (res.data.issuccess == 1) {
        // datas=res.data.data
        if (res.data.data) {
          wx.navigateTo({
            url: '../confirm/confirm?isscore=1',
          })
        } else {
          util.nocancelmodal("积分余额不足，无法购买")
        }
      } else {
        util.nocancelmodal("积分余额不足，无法购买")
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.data.data.name}`,
      imageUrl: `${headimg + this.data.data.topimg}`
    }
  }
})