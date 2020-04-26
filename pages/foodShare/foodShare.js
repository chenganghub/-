//index.js
//获取应用实例
var that,
  api = new(require('../../utils/api.js'))(),
  app = getApp(),
  headimg = api.getimgurl(),
  staticimg = api.getstaticimg(),
  util = new(require('../../utils/util.js'))()

var imgW = wx.getSystemInfoSync().windowWidth
var imgH = wx.getSystemInfoSync().windowHeight
var numCount = 5
var numSlot = 4
var mW = imgW / 1.5
var mH = imgW / 1.5
//中心点
var mCenter = mW / 2
//角度
var mAngle = (Math.PI * 2) / numCount
var mRadius = mCenter - 60 //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext('radarCanvas')

var canvasImg = ''

Page({
  data: {
    headimg: api.getimgurl(),
    staticimg: api.getstaticimg(),
    productImg: '',
    imgW,
    imgH,
    visible: false,
    showMenu: false,
    showModal: false,
    json: {},
    stepText: 5,
    chanelArray1: [],
    navHeight: '',
    statusHeight: '',
    title: '千禾味业'
  },

  onLoad(options) {
    let page = getCurrentPages(),
      that = this
    page = page[page.length - 2]
    let {
      getrank,
      data,
      item,
      dishid
    } = page.data,
      finishimg = item.finishthumb,
      chanelArray1 = []
    console.log(data, '雷达图数据')
    chanelArray1.push(['咸', data.saltness])
    chanelArray1.push(['鲜', data.freshness])
    // chanelArray1.push(['辣', data.spicy])
    chanelArray1.push(['香', data.chando])
    chanelArray1.push(['酸', data.acidity])
    chanelArray1.push(['甜', data.sweetness])
    console.log(chanelArray1)
    let senddata = data
    senddata['dishid'] = wx.getStorageSync('dishid')
    senddata['id'] = getrank.id
    that.setData({
      chanelArray1,
      getrank,
      finishimg,
      senddata,
      foodId: item.id,
      foodName: item.name,
      isIphoneX: app.globalData.isIphoneX
    })

    this.drawRadar()
    this.setNavSize()
  },
  // 通过获取系统信息计算导航栏高度
  setNavSize() {
    const sysinfo = wx.getSystemInfoSync()
    const statusHeight = sysinfo.statusBarHeight
    const isiOS = sysinfo.system.indexOf('iOS') > -1
    let navHeight
    if (!isiOS) {
      navHeight = 48
    } else {
      navHeight = 44
    }
    this.setData({
      statusHeight,
      navHeight
    })
  },
  onBackClick() {
    wx.navigateBack()
  },
  onBackHomeClick() {
    wx.switchTab({
      url: '/pages/foodLab/foodLab'
    })
  },
  /**
   * 获取排名
   */
  getrank() {
    let {
      senddata
    } = this.data
    api.usergetrank(senddata, res => {
      if (res.data.issuccess == 1) {
        util.nocancelmodal('领取成功!')
      }
    })
  },
  /**
   * 海报生成完成
   */
  onImgOK(res) {
    console.log('绘制完成' + res.detail.path)
    this.setData({
        productImg: res.detail.path
      },
      () => {
        this.savePhoto()
      }
    )
  },
  handleShare() {
    this.setData({
      showMenu: true
    })
  },
  /**
   * 生成海报
   */
  generatorImg() {
    this.setData({
      json: {
        width: '750px',
        height: '1334px',
        background: '#fff',
        views: [{
            type: 'image',
            url: `${staticimg}share_bg_eva.png`,
            css: {
              width: '750px',
              height: '1334px',
              top: '0px',
              left: '0px',
              rotate: '0',
              borderRadius: '',
              borderWidth: '',
              borderColor: '#000000',
              shadow: '',
              mode: 'scaleToFill'
            }
          },
          {
            type: 'image',
            url: `${staticimg}title_bg.png`,
            css: {
              width: '522px',
              height: '122px',
              top: '32px',
              left: '127px',
              rotate: '0',
              borderRadius: '',
              borderWidth: '',
              borderColor: '#000000',
              shadow: '',
              mode: 'scaleToFill'
            }
          },
          {
            type: 'text',
            text: this.data.getrank.name,
            css: {
              color: '#fff',
              background: 'rgba(0,0,0,0)',
              width: '320px',
              height: '48px',
              top: '54px',
              left: '228px',
              rotate: '0',
              borderRadius: '',
              borderWidth: '',
              borderColor: '#000000',
              shadow: '',
              padding: '0px',
              fontSize: '42px',
              fontWeight: 'bold',
              maxLines: '2',
              lineHeight: '46px',
              textStyle: 'fill',
              textDecoration: 'none',
              fontFamily: '',
              textAlign: 'center'
            }
          },
          {
            type: 'image',
            url: `${staticimg}pan.png`,
            css: {
              width: '360px',
              height: '251px',
              top: '145px',
              left: '200px',
              rotate: '0',
              borderRadius: '',
              borderWidth: '',
              borderColor: '#000000',
              shadow: '',
              mode: 'scaleToFill'
            }
          },
          {
            type: 'image',
            url: `${headimg}${this.data.finishimg}`,
            css: {
              height: '230px',
              top: '150px',
              left: '230px',
              rotate: '0',
              borderRadius: '',
              borderWidth: '',
              borderColor: '#000000',
              shadow: '',
              mode: 'scaleToFill'
            }
          },
          {
            type: 'image',
            url: canvasImg,
            css: {
              width: `480px`,
              height: `480px`,
              left: `135px`,
              top: '370px'
            }
          },
          {
            type: 'text',
            text: this.data.getrank.description,
            css: {
              color: '#000000',
              background: 'rgba(0,0,0,0)',
              width: '536px',
              height: '94px',
              top: '840px',
              left: '100px',
              rotate: '0',
              borderRadius: '',
              borderWidth: '',
              borderColor: '#000000',
              shadow: '',
              padding: '0px',
              fontSize: '24px',
              fontWeight: 'normal',
              maxLines: '2',
              lineHeight: '46px',
              textStyle: 'fill',
              textDecoration: 'none',
              fontFamily: '',
              textAlign: 'center'
            }
          },
          {
            "type": "image",
            "url": `${staticimg}qianhe.jpg`,
            "css": {
              "width": "120px",
              "height": "120px",
              "top": "1140px",
              "left": "579px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "mode": "scaleToFill"
            }
          },
          {
            "type": "text",
            "text": "更多厨艺头衔\n等你来挑战",
            "css": {
              "color": "#363636",
              "background": "rgba(0,0,0,0)",
              "width": "200px",
              "height": "74.68799999999997px",
              "top": "1169px",
              "left": "361px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "24px",
              "fontWeight": "normal",
              "maxLines": "2",
              "lineHeight": "37.296px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "right"
            }
          }
        ]
      }
    })
  },
  // 雷达图
  drawRadar: function() {
    var sourceData1 = this.data.chanelArray1

    //调用
    this.drawEdge()
    this.drawLinePoint()
    //设置数据
    this.drawRegion(sourceData1, 'rgba(254,203,164,0.5)') //第一个人的

    //设置文本数据
    this.drawTextCans(sourceData1)

    //开始绘制
    radCtx.draw()
  },
  // 绘制6条边
  drawEdge: function() {
    radCtx.setStrokeStyle('#aaa')
    radCtx.setLineWidth(1) //设置线宽
    for (var i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      var rdius = (mRadius / numSlot) * (i + 1)
      // //画6条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var x = mCenter + rdius * Math.sin(mAngle * j)
        var y = mCenter - rdius * Math.cos(mAngle * j)
        radCtx.lineTo(x, y)
      }
      radCtx.closePath()
      radCtx.stroke()
    }
  },
  // 绘制连接点
  drawLinePoint: function() {
    radCtx.beginPath()
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.sin(mAngle * k)
      var y = mCenter - mRadius * Math.cos(mAngle * k)

      radCtx.moveTo(mCenter, mCenter)
      radCtx.lineTo(x, y)
    }
    radCtx.stroke()
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function(mData, color) {
    radCtx.beginPath()
    for (var m = 0; m < numCount; m++) {
      var x = mCenter + (mRadius * Math.sin(mAngle * m) * mData[m][1]) / 100
      var y = mCenter - (mRadius * Math.cos(mAngle * m) * mData[m][1]) / 100

      radCtx.lineTo(x, y)
    }
    radCtx.closePath()
    radCtx.setFillStyle(color)
    radCtx.fill()
  },

  //绘制文字
  drawTextCans: function(mData) {
    radCtx.setFillStyle('#222')
    radCtx.font = 'bold 17px cursive' //设置字体
    for (var n = 0; n < numCount; n++) {
      var x = mCenter + mRadius * Math.sin(mAngle * n)
      var y = mCenter - mRadius * Math.cos(mAngle * n)
      // radCtx.fillText(mData[n][0], x, y);
      //通过不同的位置，调整文本的显示位置
      if (mAngle * n == 0) {
        radCtx.fillText(mData[n][0], x - 7, y - 5)
      } else if (mAngle * n > 0 && mAngle * n <= Math.PI / 2) {
        radCtx.fillText(mData[n][0], x + 3, y + 5)
      } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
        radCtx.fillText(
          mData[n][0],
          x,
          y + 15
        )
      } else if (mAngle * n > Math.PI && mAngle * n <= (Math.PI * 3) / 2) {
        radCtx.fillText(
          mData[n][0],
          x - radCtx.measureText(mData[n][0]).width,
          y + 15
        )
      } else {
        radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width - 2, y + 5)
      }
    }
  },
  drawImg() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: imgW,
      height: imgH,
      canvasId: 'radarCanvas',
      success: res => {
        canvasImg = res.tempFilePath
        this.generatorImg()
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  savePhoto() {
    const that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.productImg,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        })
        that.setData({
          showModal: true
        })
      },
      fail(res) {
        wx.showToast({
          title: '保存失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  saveBtn() {
    console.log('触发保存图片事件------------------')
    let that = this
    this.setData({
      showMenu: false
    })
    wx.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //用户允许授权，保存图片到相册
              wx.showLoading({
                title: '保存中...',
                mask: true
              })
              that.drawImg()
            },
            fail() {
              //用户点击拒绝授权，跳转到设置页，引导用户授权
              // 未授权获取地址
              wx.showModal({
                confirmColor: '#FE8F71',
                content: '无法保存图片到相册，请授权保存图片到相册',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success() {
                        wx.showLoading({
                          title: '保存中...',
                          mask: true
                        })
                        that.drawImg()
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          //用户已授权，保存到相册
          console.log('图片开始绘制')
          wx.showLoading({
            title: '保存中...',
            mask: true
          })
          that.drawImg()
        }
      }
    })
  },
  hideMenu() {
    console.log('触发隐藏菜单事件------------------')
    if (this.data.showMenu) {
      this.setData({
        showMenu: false
      })
    }
    if (this.data.showModal) {
      this.setData({
        showModal: false
      })
    }
  },
  onShareAppMessage: function(res) {
    return {
      title:'更多厨艺头衔，等你来挑战',
      path: '/pages/foodLab/foodLab?share=' + wx.getStorageSync('user').id
    }
  },
  onShareClick() {
    console.log('触发分享事件------------------')
    this.setData({
        showMenu: false
      },
      () => {
        this.setData({
          showModal: true
        })
      }
    )
  },
  toDetail() {
    console.log('触发领取秘籍事件------------------')
    wx.showLoading({
      title: '领取中',
      mask: true
    })
    api.getBook({
        userId: wx.getStorageSync('user').id,
        dishId: wx.getStorageSync('dishid'),
        dishRankId: this.data.getrank.id
      },
      res => {
        wx.hideLoading()
        if (res.data.issuccess == 1) {
          this.setData({
            showModal: false
          })
          wx.navigateTo({
            url: '/pages/bookstoreDetail/bookstoreDetail?id=' + this.data.foodId
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '领取失败'
          })
        }
      }
    )
  }
})