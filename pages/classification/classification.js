 var that,
   api = new(require('../../utils/api.js'))(),
   app = getApp(),
   headimg = api.getimgurl(),
   util = new(require('../../utils/util.js'))()
 Page({
   /**
    * 页面的初始数据
    */
   data: {
     toTime: "",
     showLogin: false,
     headimg: api.getimgurl(),
     staticimg: api.getstaticimg(),
     commodityList: [],
     cateindex: -2,
     pagesize: 20,
     start: 0,
     cid: 0,
     btnIndex: -2,
     show: false,
     src: '../pic/up.png',
     goods: [],
     allLabels: [],
     promotionprice: '',
     shareId: 0, // 分享来源用户id
     list: [],
     modelFlag: false,
     newCouponData: {},
     groupGoods: [],

     visible: false
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
     that = this
     that.setData({
       shareid: options.share || 0
     })
     wx.showLoading({
       title: '加载中',
     
     })
   },
   onShow() {
     if (app.logininfo) {
       that.getdata()
     } else {
       util.setwatcher(app, this.afterlogin)
     }
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
   //优惠券商品详情
   goDetail(e) {
     let {
       id
     } = e.currentTarget.dataset
     wx.navigateTo({
       url: '../goodsDetail/goodsDetail?id=' + id
     })
   },
   afterlogin: {
     token: res => {
       that.getdata()
     },
     isNew: res => {
       if (res) {
         that.getNewUserCoupon()
         that.setData({
           modelFlag: true
         })
       }
     }
   },
   /**
    * 点击幻灯
    */
   toswiperd(e) {
     let {
       path
     } = e.currentTarget.dataset
     if (path != null) {
       wx.navigateTo({
         url: path
       })
     }
   },


   goToAssemble(e) {
     clearInterval(this.data.toTime)
     wx.navigateTo({
       url: '/pages/assemble/assemble?id=' + JSON.stringify(e.target.dataset.id),
       success: function (res) {},
       fail: function (res) {},
       complete: function (res) {},
     })
   },

   getdata() {
     let {
       commodityList,
       pagesize,
       shareid,
       start,
       goods,
       labels,
       promotionprice,
     } = that.data
     // 邀请新用户
     if (shareid) {
       api.share(shareid, getCurrentPages()[0].route, res => {
         if (res.data.issuccess) {
           console.log(res, 'res')
         }
       })
     }
     // 获取幻灯
     api.getswipers(res => {
       if (res.data.issuccess == 1) {
         that.setData({
           swipers: res.data.list
         })
       }else{
         wx.showToast({
           title: res.msg,
         })
       }

     })
     // 前端获取商品分类列表
     api.getCommodityList(res => {
       if (res.data.issuccess == 1) {
         commodityList = res.data.list
         that.setData({
             commodityList
           }
         )
       }else{
        wx.showToast({
          title: res.msg,
        })
      }
     })
     // 前端获取全部商品列表
     if (start == 0) goods = []
     api.getAllCommodityGoods({
         pagesize,
         start
       },
       res => {
         if (res.data.issuccess == 1) {
           labels = res.data.list2
           res.data.list.forEach((x, i) => {
             let newsrc = headimg + x.topimg
             promotionprice = (x.promotionprice / 100).toFixed(2)
             goods.push([x, newsrc, promotionprice])
           })
           that.setData({
             goods,
             reachbtm: goods.length == res.data.total,
             labels
           })
         }else{
          wx.showToast({
            title: res.msg,
          })
        }
       }
     )

     // 前端获取拼团商品
     api.getAllgroupGoods({}, res => {
       clearInterval(this.data.toTime)
       let than = this;
       if (res.data.issuccess == 1) {

         // 活动结束时间 单独提出来
         let endTimeList = [];
         // 将活动的结束时间参数提成一个单独的数组，方便操作
         res.data.list.forEach(o => {
           endTimeList.push(o.endtime)
           o.teamprice = (o.teamprice / 100).toFixed(2)
         })
         this.setData({
           groupGoods: res.data.list
         })
         // 执行倒计时函数
         util.countDown('countDownList', endTimeList, this)
       }
     })

     wx.hideLoading()
   },

   tabtap(e) {
     //如果点击同一个分类，return
     let {
       cateindex
     } = that.data, {
       index
     } = e.currentTarget.dataset
     console.log(index, 'index')
     if (cateindex == index) return
     that.setData({
       goods: []
     })
     let {
       pagesize,
       start,
       goods,
       commodityList,
       promotionprice
     } = that.data
     if (index == -2) {
       that.setData({
           cateindex: index,
           start: 0
         },
         () => {
           that.getlist()
         }
       )
     } else {
       var {
         id,
         labels
       } = e.currentTarget.dataset
       that.setData({
           cateindex: index,
           start: 0,
           id,
           labels
         },
         () => {
           that.getlist()
         }
       )
     }
   },
   /**
    * 前端获取全部商品列表
    */
   getlist() {
     let {
       cateindex,
       pagesize,
       start,
       goods,
       commodityList,
       promotionprice,
       id,
       labels
     } = that.data
     if (cateindex == '-2') {
       api.getAllCommodityGoods({
           pagesize,
           start
         },
         res => {
           if (res.data.issuccess == 1) {
             labels = res.data.list2
             res.data.list.forEach((x, i) => {
               let newsrc = headimg + x.topimg
               promotionprice = (x.promotionprice / 100).toFixed(2)
               goods.push([x, newsrc, promotionprice])
             })
             that.setData({
               goods,
               labels,
               reachbtm: goods.length == res.data.total
             })
           }
         }
       )
     } else {
       api.getCommodityGoods({
           pagesize,
           start,
           cid: id
         },
         res => {
           if (res.data.issuccess == 1) {
             res.data.list.forEach((x, i) => {
               let newsrc = headimg + x.topimg
               promotionprice = (x.promotionprice / 100).toFixed(2)
               goods.push([x, newsrc, promotionprice])
             })
             that.setData({
               goods,
               reachbtm: goods.length == res.data.total
             })
           }
         }
       )
     }
   },
   jumptogoodsdetail(e) {
     let {
       id
     } = e.currentTarget.dataset
     wx.navigateTo({
       url: '../goodsDetail/goodsDetail?id=' + id
     })
   },
   gotoshopingcart() {
     this.loginModal(() => {
       wx.navigateTo({
         url: '../cart/cart'
       })
     })
   },
   toVoucherCenter() {
     api.getCouponlist({
       start: 0,
       pagesize: 100000000
     }, res => {
       if (res.data.issuccess === 1) {
         if (res.data.total > 0) {
           this.loginModal(() => {
             wx.navigateTo({
               url: '../VoucherCenter/VoucherCenter'
             })
           })
         } else {
           this.setData({
             visible: true
           })
         }
       }
     })

   },

   handleClose() {
     this.setData({
       visible: false
     })
   },

   gotolist(e) {
     let {
       id,
       name
     } = e.currentTarget.dataset
     console.log(id)
     that.setData({
         catename: name
       },
       () => {
         wx.navigateTo({
           url: '../list/list?id=' + id
         })
       }
     )
   },
   pageToAllList: function () {
     wx.navigateTo({
       url: '../list/list?type=' + 1
     })
   },
   toIntegralmall() {
     api.getscoregoodslist({
       pagesize: 10000000,
       start: 0
     }, res => {
       if (res.data.issuccess == 1) {
         if (res.data.list.length > 0) {
           wx.navigateTo({
             url: '../scoregoods/scoregoods'
           })
           return
         }
         this.setData({
           visible: true
         })
       } else {
         this.setData({
           visible: true
         })
       }
     })

   },

   togame() {
     this.loginModal(() => {
       api.getawardinfo(res => {
         if (res.data.issuccess === 1) {
           if (res.data.result === 'true') {
             wx.navigateTo({
               url: '../game/game'
             })
           } else {
             this.setData({
               visible: true
             })

           }
         }
       })
     })
   },

   /**
    * 新人获取优惠卷弹窗信息
    */
   getNewUserCoupon() {
     api.getNewUserCoupon(res => {
       if (res.data.issuccess === 1) {
         this.setData({
           newCouponData: res.data.data
         })
       }
     })
   },
   /**
    * 领取新人优惠卷
    */
   getNewCoupon() {
     const {
       newCouponData
     } = this.data
     api.receivecoupon(newCouponData.couponDetail.id, res => {
       if (res.data.issuccess === 1) {
         wx.showToast({
           title: '领取成功'
         })

       } else {
         wx.showToast({
           icon: 'none',
           title: res.data.msg
         })
         this.setData({
           modelFlag: false
         })
       }
     })
   },
   closeModel() {
     this.setData({
       modelFlag: false
     })
   },
   bindGetUserInfo(e) {
     console.log(e.detail)
     if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
       this.getNewCoupon()
     } else {
       let {
         nickName,
         avatarUrl
       } = e.detail.userInfo
       api.modifyUser({
           openid: wx.getStorageSync('openid'),
           nickname: nickName,
           avatarUrl
         },
         res => {
           if (res.data.issuccess == 1) {
             let user = wx.getStorageSync('user')
             console.log(user, "user")
             console.log(avatarUrl, "avatarUrl")
             console.log(nickName, "nickName")
             user.avatarUrl = avatarUrl
             user.nickname = nickName
             wx.setStorageSync('user', user)
             this.getNewCoupon()
           }
         }
       )
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
   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {},

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
     let {
       reachbtm
     } = this.data
     if (reachbtm) {
       return
     }
     that.setData({
         start: that.data.start + that.data.pagesize
       },
       () => {
         that.getlist()
       }
     )
   },
   toMember() {
     this.loginModal(() => {
       wx.navigateTo({
         url: '/pages/memberDuty/memberDuty',
       })
     })
   },
   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {
     return {
       title: '千禾零添加，天然好味道',
       path: '/pages/classification/classification?share=' +
         wx.getStorageSync('user').id
     }
   },
   onHide: function () {
     clearTimeout(this.data.toTime)
   },
 })