// pages/memberDuty/memberDuty.js
const api = new(require('../../utils/api.js'))
const staticimg = api.getstaticimg()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: { // 用户等级权益信息
      difference: 0,
      gradeId: 0,
      growthName: '',
      userGrowth: 0,
      maxGrowth: 0
    },
    today: true,
    signCount: 0, // 签到次数
    newTask: [], // 新人任务
    everyDayTask: [], // 每日任务
  },

  // 签到
  sign() {
    const userId = wx.getStorageSync('user').id
    console.log(userId)
    api.sign(
      userId, res => {
        if (res.data.issuccess === 1) {
          wx.showToast({
            title: '签到成功',
          })
          this.getDuty()
          this.getSign()
          // 获取会员的权益
          const data = {
            userId: wx.getStorageSync('user').id,
          }
          api.getMemberEquitys(data, res => {
            try {
              const {
                issuccess,
                data
              } = res.data
              console.log(res)
              if (issuccess === 1) {
                this.setData({
                  user: {
                    ...this.data.user,
                    difference: data.difference,
                    gradeId: data.gradeId,
                    growthName: data.growthName,
                    userGrowth: data.userGrowth,
                    maxGrowth: data.maxGrowth,
                    nextGradeName: data.nextGradeName
                  }
                }, () => {
                  console.log(this.data.user)
                })
              }
            } catch (e) {
              console.log(e)
            }
          })
        } else {
          wx.showToast({
            title: '签到失败',
          })
        }
      })
  },

  // 获取签到
  getSign() {
    const data = {
      userId: wx.getStorageSync('user').id,
    }
    api.getSign(data, res => {
      try {
        const {
          issuccess,
          msg,
          today
        } = res.data
        if (issuccess === 1) {
          this.getDuty()
          this.setData({
            signCount: msg.length,
            today
          })
        }
      } catch (e) {
        console.log(e)
      }
    })
  },

  // 获取任务
  getDuty() {
    const data = {
      userId: wx.getStorageSync('user').id
    }
    api.getMemberDuty(data, res => {
      try {
        const {
          issuccess,
          data
        } = res.data
        console.log(res)
        if (issuccess === 1) {
          this.setData({
            newTask: data.newTask,
            everyDayTask: data.everydayTask
          }, () => {
            console.log(this.data)
          })
        }
      } catch (e) {
        console.log(e)
      }
    })
  },


  // 分享首页
  onShareAppMessage: function(ops) {
    return {
      title: '千禾送您一份优惠大礼包，赶快来领取吧！',
      imageUrl: `${staticimg}share_banner.png`, //图片地址
      path: `/pages/classification/classification?share=${wx.getStorageSync('user').id}`, // 用户点击首先进入的当前页
    }

  },
  /**
   * 获取手机号接口
   */
  getPhoneNumber(e) {
    console.log(e.detail)
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      api.bindPhone({
        userId: wx.getStorageSync('user').id,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }, res => {
        if (res.data.issuccess === 1) {
          this.getDuty()
        } else {
          wx.showToast({
            icon: 'none',
            title: '绑定失败',
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '绑定失败',
      })
    }

  },
  /**
   * 新手任务
   */
  newMission(e) {
    const {
      code
    } = e.currentTarget.dataset
    switch (code) {
      case 'phone':
        {
          // 绑定手机

          break
        }
      case 'info':
        {
          // 完善资料
          wx.navigateTo({
            url: '/pages/member/member',
          })
          break
        }
      case 'bjnews':
        {
          // 关注公众号
          wx.previewImage({
            urls: [`${staticimg}WechatIMG4.jpg`],
            current: `${staticimg}WechatIMG4.jpg`, // 当前显示图片的http链接
          })
          break
        }
      case 'firstshop':
        {
          // 首次购物
          wx.switchTab({
            url: '/pages/classification/classification',
          })
          break
        }
      default:
        {
          break
        }
    }
  },
  /**
   * 日常任务
   */
  dailyTasks(e) {
    const {
      code
    } = e.currentTarget.dataset
    switch (code) {
      case 'sign':
        {
          // 每日签到
          this.getSign()
          break
        }
      case 'share':
        {
          // 分享美食报告
          wx.switchTab({
            url: '/pages/foodLab/foodLab',
          })
          break
        }
      case 'title':
        {
          // 领取美食实验室头衔
          wx.switchTab({
            url: '/pages/foodLab/foodLab',
          })
          break
        }
      case 'clock':
        {
          // 每日美味发布
          wx.switchTab({
            url: '/pages/foodsShow/foodsShow',
          })
          break
        }
      case 'invite':
        {
          // 邀请好友注册绑定
          break
        }
      case 'friendshop':
        {
          // 好友首次购买

          break
        }
      default:
        {
          break
        }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSign()
    // 获取任务
    this.getDuty()
    // 获取会员的权益
    const data = {
      userId: wx.getStorageSync('user').id,
    }
    api.getMemberEquitys(data, res => {
      try {
        const {
          issuccess,
          data
        } = res.data
        console.log(res)
        if (issuccess === 1) {
          this.setData({
            user: {
              ...this.data.user,
              difference: data.difference,
              gradeId: data.gradeId,
              growthName: data.growthName,
              userGrowth: data.userGrowth,
              maxGrowth: data.maxGrowth,
              nextGradeName: data.nextGradeName
            }
          }, () => {
            console.log(this.data.user)
          })
        }
      } catch (e) {
        console.log(e)
      }
    })
  }
})