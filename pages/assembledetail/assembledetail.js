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
    goodscount:0,// 商品数量
    price :0,// 总价格
    goodsnum:'',//  商品编号
    id:0,
    isscore:'F'
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    that = this;
    let address = wx.getStorageSync('def_address');
    if (address) {
      that.setData({
        address: address.province + address.city + address.county + address.street,
        addressid: address.id
      })
    }
    let {id , iscollect} =that.data
    id=options.id
    that.setData({id},()=>{
      that.getdetail()
    })
 
  },
 getdetail(){
   wx.showLoading({
     title: '加载中',
     mask
   })
  let {id , iscollect} =that.data
  api.getGoodsDetail(id, res => {
    wx.hideLoading({
    })
    if (res.data.issuccess == 1) {
      iscollect=res.data.iscollect
      that.setData({
        data: res.data.data,
        iscollect
      })
      console.log(iscollect,'iscollectiscollect')
    }
    console.log(res.data, 'res.data')
    let { detail, price, stock, lbimg, name, promotionprice,goodsunit,topimg,goodssn} = that.data.data
    promotionprice = (promotionprice / 100).toFixed(2)
    price = (price / 100).toFixed(2)
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
      goodssn
    })
  })
 },
  tocart(){
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
  choicetap(){
    console.log(11)
    that.setData({
      showchose: !0,
      anim: 'sizewrap 0.3s'
    })
  },
  btntap(e) {
    console.log(e,'eeee')
    let code=e.currentTarget.dataset.code,
      { goodsnum, goodssn, goodscount, count, price, promotionprice } = that.data
    console.log(count,'count')
    console.log(price, 'price')
    price = count * promotionprice
    that.setData({
      showchose: !0,
      anim: 'sizewrap 0.3s',
      price
    })
    if(code==2){
      // api.addshoppingCart({ goodsnum: goodssn, goodscount: count, price},res=>{
      //   if (res.data.issuccess == 1) {
      //     console.log(1)
      //   }
      // })
    }
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
      count
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
    that.setData({
      count
    })
  },
  sizeconfirm(){
    // wx.navigateTo({
    //   url: '../cart/cart',
    // })
    // that.setData({
    //   showchose: !0,
    //   anim: 'sizewrap 0.7s'
    // })
    let 
      { goodsnum, goodssn, goodscount, count, price, promotionprice } = that.data
        console.log(count, 'count')
        console.log(price, 'price')
        price =  promotionprice*100
        goodsnum = goodssn
        goodscount= count
        that.setData({ price, goodsnum, goodscount})
        api.addshoppingCart({ goodsnum, goodscount, price }, res => {
          if (res.data.issuccess == 1) {
            wx.showToast({
              title: '添加成功！',
            })
          }
        })
    that.setData({
      showchose: !1,
      anim: '',
    })
  },
  // addcart(){
  //   console.log(1)
  //   // api.addshoppingCart
  //   // let { goodsnum  }=that.data
  //   // console.log(goodsnum  ,'name')
  //   that.setData({
  //     showchose: !0,
  //     anim: 'sizewrap 0.7s'
  //   })
  //   let { goodssn }=that.data
  //   console.log(goodssn,'goodssn')
  // },
  collectiongoods(e){
    wx.showLoading({
      title: '加载中',
      mask
    })
    let {id,isscore,iscollect}=that.data
    console.log(e.currentTarget.dataset.iscollect,'eeeee')
    api.collectiongoods({ goodsid:id , isscore}, res => {
      // wx.hideLoading({
      //   complete: (res) => {},
      // })
      if (res.data.issuccess == 1) {
        wx.showToast({
          title: iscollect?'取消收藏':'收藏成功',
          icon: 'none',
          success:res=>{
            that.setData({iscollect:!iscollect})
          }
        })
      }   
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
      let address = that.data.address;
    if(typeof(address)=='object'){
      that.setData({address:address.province+address.city+address.county+address.street})
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})