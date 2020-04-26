var that,
  WxParse = require('../../wxParse/wxParse.js'),
  api = new(require('../../utils/api.js'))(),
  app = getApp(),
  timer = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    headimg: api.getimgurl(),
    staticimg: api.getstaticimg(),
    jumpFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    that = this
    let page = getCurrentPages()
    page = page[page.length - 2]
    let selectitem = page.data.selectitem
    that.setData({
      selectitem,
      isIphoneX: app.globalData.isIphoneX,
      namewidth: selectitem.name.length * 36
    })
    WxParse.wxParse(
      'article',
      'html',
      decodeURIComponent(selectitem.description),
      that,
      5
    )
  },

  action() {
    if (!this.data.jumpFlag) {
      this.setData({
        jumpFlag: true
      }, () => {
        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease'
        })
        this.animation = animation
        var next = true
        var num = 0
        var opacity = 1
        var timerNum = 100
        //连续动画关键步骤
        timer = setInterval(() => {
          num += 1
          opacity -= 0.04
          //2: 调用动画实例方法来描述动画
          if (next) {
            animation
              .translateX(10 + num * 2)
              .opacity(opacity)
              .step()
            //  animation.rotate(30).step()
            next = !next
          } else {
            animation
              .translateX(-(10 + num * 2))
              .opacity(opacity)
              .step()
            //  animation.rotate(-30).step()
            next = !next
          }
          //3: 将动画export导出，把动画数据传递组件animation的属性
          this.setData({
            animation: animation.export()
          })
        }, timerNum)

        setTimeout(() => {
          if (timer) {
            clearInterval(timer)
          }
          wx.navigateTo({
            url: '../foodDetail/foodDetail'
          })
        }, 1500)
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease'
    })
    animation
      .translateX(0)
      .opacity(1)
      .step()
    this.setData({
      animation: animation.export(),
      jumpFlag: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (timer) {
      clearInterval(timer)
    }
  }
})