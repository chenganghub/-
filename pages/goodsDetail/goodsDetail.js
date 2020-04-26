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
    typesku:false,//
    selectedSku1:"",//已选sku
    selectedSku2:"",//已选sku
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
    totalPrice: 0, // 总价格
    goodsnum: '', //  商品编号
    id: 0,
    isscore: 'F',
    specList: [], // 规格列表
    specIndex: 0, // 一级选中规格下标
    specValue: '', // 规格名称
    specdetailid: '', //二级规格id
    specid: '', // 一级规格id
    showLogin: false,
    goodsnums: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
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
      iscollect
    } = that.data
    id = options.id
    that.setData({
      id
    }, () => {
      that.getdetail()
      this.goods()
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
  getdetail() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let {
      id,
      iscollect
    } = that.data
    api.getGoodsDetail(id, res => {
      wx.hideLoading({})
      if (res.data.issuccess == 1) {
        const detailData = res.data.data
        iscollect = res.data.iscollect
        that.setData({
          data: detailData ? detailData.goods : {},
          iscollect,
          specList: detailData.spec
        })
        let {
          specValue,
          specid,
          selectedSku1,
              selectedSku2,
          specdetailid
        } = that.data
        let {
          detail,
          stock,
          lbimg,
          name,
          goodsunit,
          topimg,
          goodssn,
          viewlabel,
          promotionprice,
          price
        } = detailData.goods
        if (viewlabel) {
          api.setlabels({
            labels: viewlabel
          }, () => {})
        }
        // 判断是否有规格
        if (detailData.spec && detailData.spec.length) {
          this.setData({typesku:true})
          console.log("商品有规格————-——————")
          // 判断是否有二级规格
          if (detailData.spec[0].specInfo && detailData.spec[0].specInfo.length) {
            if (detailData.spec[0].specInfo[0].detailValue && detailData.spec[0].specInfo[0].detailValue.length) {
              // 有二级规格
              console.log("商品有二级规格————-——————")
              stock = detailData.spec[0].specInfo[0].detailValue[0].detailValueInfo[0].inventory
              const item = detailData.spec[0].specInfo[0].detailValue[0].detailValueInfo[0]
              console.log(detailData.spec[0].specInfo)
              selectedSku1=detailData.spec[0].specInfo[0].specValueName,//已选sku
              selectedSku2=detailData.spec[0].specInfo[0].detailValue[0].detailValueInfo[0].specValueName,//已选sku
              promotionprice = (item.memberPrice / 100).toFixed(2)
              price = (item.price / 100).toFixed(2)
              specdetailid = item.id
              specValue = item.specValueName
            } else {
              // 无二级规格
              console.log("商品只有一级规格————-——————")
              console.log(stock, "商品只有一级规格——")
              console.log(detailData.spec[0].specInfo)
              stock = detailData.spec[0].specInfo[0].inventory
              const item = detailData.spec[0].specInfo[0]
              selectedSku2=item.specValueName,//已选sku
              promotionprice = (item.memberPrice / 100).toFixed(2)
              price = (item.price / 100).toFixed(2)
              specid = item.id
              specValue = ''
            }
          } else {
            // 只添加了一级规格标题，没添加规格内容
            promotionprice = (promotionprice / 100).toFixed(2)
            price = (price / 100).toFixed(2)
          }
        } else {
          console.log("商品无规格————-——————")
          promotionprice = (promotionprice / 100).toFixed(2)
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
          price,
          stock,
          goodsunit,
          topimg,
          goodssn,
          specid,
          selectedSku1,
              selectedSku2,
          specValue,
          specdetailid
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
  btntap(e) {
    this.loginModal(() => {
      let code = e.currentTarget.dataset.code,
        {
          goodsnum,
          goodssn,
          goodscount,
          count,
          totalPrice,
          promotionprice
        } = that.data
      totalPrice = (count * promotionprice).toFixed(2)
      that.setData({
        showchose: !0,
        anim: 'sizewrap 0.3s',
        totalPrice
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
      promotionprice
    } = that.data

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
    if (stock < count) {
      wx.showToast({
        title: '已达到库存最大值',
        image: "../pic/warning.png",
        mask: true,
      })
      return
    }
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
      stock
    } = that.data
    if(stock<1){
      wx.showToast({
        title: '库存不足',
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
          this.goods()
        }
      })
    } else {
      console.log("直接购买")
      wx.navigateTo({
        url: '../confirm/confirm?gobuy=1&promotionprice=' + price,
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
        iscollect
      } = that.data
      console.log(e.currentTarget.dataset.iscollect, 'eeeee')
      api.postCollection({
        userid: wx.getStorageSync('userid'),
        goodsid: id,
        type: '1',
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
  onShow: function() {
    let address = that.data.address;
    if (typeof(address) == 'object') {
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
    if (items.detailValue.length < 1) {
      stock = items.inventory,
      promotionprice=(items.memberPrice/100).toFixed(2)
      totalPrice= (count * (items.memberPrice / 100)).toFixed(2)
    } else {
      stock = items.detailValue[0].detailValueInfo[0].inventory
      promotionprice = items.detailValue[0].detailValueInfo[0].memberPrice
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
      promotionprice: (item.memberPrice / 100).toFixed(2),
      price: (item.price / 100).toFixed(2),
      totalPrice: (count * (item.memberPrice / 100)).toFixed(2)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: `${this.data.data.name}`,
      imageUrl: `${headimg + this.data.data.topimg}`
    }
  },
  goods() {
    api.getCartlist({}, res => {
      if (res.data.issuccess == 1) {
        if (res.data.list.length < 100 && res.data.list.length > 0) {
          that.setData({
            goodsnums: res.data.list.length
          });
        } else {
          that.setData({
            goodsnums: '。。。'
          });
        }

      }
    });
  },
  onShow() {
    this.goods()
  }
})