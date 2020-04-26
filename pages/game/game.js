/**
 * 大转盘抽奖
 */
var that,
  api = new(require('../../utils/api.js'))(),
  app = getApp(),
  headimg = api.getimgurl(),
  staticimg = api.getstaticimg(),
  util = new(require('../../utils/util.js'))()

Page({
  data: {
    staticimg,
    awardsList: [],
    animationData: {},
    btnDisabled: '',
    usercount: 0,
    startBtnFlag: true,
    awardsConfig: {
      chance: true,
      awards: []
    },
    ismodshow: !1,
    integral: 0,
    prize: [],
    integralNumber: 0,
    // 0次数、1积分
    manner: 0
  },
  // onShow: function() {
  //   that = this;
  //   if (app.logininfo) {
  //     that.getdata();
  //   }
  // },
  onLoad() {
    that = this
    wx.showLoading({
      title: '加载中',
     
    })
    that.setData({
        isIphoneX: app.globalData.isIphoneX
      },
      () => {
        if (app.checkLogin()) {
          that.getdata()
        } else {
          wx.switchTab({
            url: '/pages/classification/classification',
          })
        }
      }
    )
  },
  getdata() {
    let {
      awardsConfig,
      usercount
    } = that.data,
      bgurl = ''
    api.awardsfindbyid(res => {
      console.log(res.data)
      if (res.data.issuccess == 1) {
        let {
          data,
          gifts,
          integral,
          prize
        } = res.data
        // bgurl = headimg + data.bgsrc
        Array.isArray(gifts) && gifts.forEach((x, i) => {
          x.imgurl = `${headimg}${x.imgurl}`
        })
        awardsConfig.awards = gifts

        usercount =
          res.data.usercount == -1 ? res.data.data.limit : res.data.usercount
        console.log(usercount, "usercount")
        console.log(res.data.usercount, "res.data.usercount")
        that.setData({
          integralNumber: res.data.data.number,
          manner: res.data.data.manner,
          data,
          awardsConfig,
          usercount,
          integral,
          prize
        })
        that.drawAwardRoundel(awardsConfig, usercount)
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg
        })
      }
      wx.hideLoading()
    })
  },
  rule() {
    console.log(222)
    that.setData({
      ismodshow: !0
    })
  },
  ok() {
    that.setData({
      ismodshow: !1
    })
  },
  // onReady: function(e) {
  //   //分享
  //   wx.showShareMenu({
  //     withShareTicket: true
  //   });
  // },

  //画抽奖圆盘
  drawAwardRoundel(awardsConfig, usercount) {
    console.log('画圆盘', awardsConfig)
    var awards = awardsConfig.awards
    var awardsList = []
    //文字旋转 turn 值
    var turnNum = 1 / awards.length
    // let {
    //   usercount
    // } = that.data;
    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({
        turn: i * turnNum + 'turn',
        lineTurn: i * turnNum + turnNum / 2 + 'turn',
        award: awards[i]
      })
    }

    this.setData({
        btnDisabled: this.data.awardsConfig.chance ? '' : 'disabled',
        awardsList
      },
      () => {
        wx.hideLoading()
      }
    )
    console.log(this.data.awardsList)
  },

  //发起抽奖
  playReward: function() {
    if (this.data.startBtnFlag) {
      this.setData({
        startBtnFlag: false
      })
      let awardIndex = 0,
        data = '',
        duration = 4000 //时长
      api.awardschou(this.data.data.id, res => {
        if (res.data.issuccess == 1) {
          data = res.data.data
          this.data.awardsList.forEach((item, index) => {
            awardIndex = item.award.id === data.id ? index : awardIndex
          })
          console.log(awardIndex)
          // 旋转角度
          this.runDeg = this.runDeg || 0
          this.runDeg =
            this.runDeg - (this.runDeg % 360) + (360 * 8 - awardIndex * (360 / 8))
          console.log(this.runDeg)
          //创建动画
          var animationRun = wx.createAnimation({
            duration: duration,
            timingFunction: 'ease'
          })
          animationRun.rotate(this.runDeg).step()
          this.setData({
            animationData: animationRun.export(),
            btnDisabled: 'disabled'
          })

          // 中奖提示
          // var awardsConfig = this.data.awardsConfig;
          if (data.type == -1) {
            setTimeout(
              function() {
                wx.showModal({
                  title: '很遗憾',
                  confirmColor: '#FE8F71',
                  content: '什么也没有',
                  showCancel: false
                })
                this.setData({
                  btnDisabled: '',
                  usercount: res.data.usercount
                })
                that.getdata()
              }.bind(this),
              duration
            )
          } else {
            setTimeout(
              function() {
                wx.showModal({
                  title: res.data.msg ? '很遗憾' : '恭喜',
                  confirmColor: '#FE8F71',
                  content: res.data.msg || '获得' + data.name,
                  showCancel: false
                })
                this.setData({
                  btnDisabled: '',
                  usercount: res.data.usercount
                })
                that.getdata()
              }.bind(this),
              duration
            )
          }
        } else {
          wx.showModal({
            title: '',
            confirmColor: '#FE8F71',
            content: res.data.msg,
            showCancel: false
          })
        }
      })

      setTimeout(() => {
        this.setData({
          startBtnFlag: true
        })
      }, 5000)


    }

  },
  tomyprize() {
    wx.navigateTo({
      url: '../myprize/myprize'
    })
  },
  onShareAppMessage: function() {
    return {
      title: `好礼送不停，优惠价更低`
    }
  }
})