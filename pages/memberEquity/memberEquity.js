// pages/memberEquity/memberEquity.js
const api = new(require('../../utils/api.js'))

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
    length: 0,
    levels: [] // 所有等级

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const data = {
      userId: wx.getStorageSync('user').id,
    }

    // 获取会员的权益
    api.getMemberEquitys(data, res => {
      try {
        const {
          issuccess,
          data
        } = res.data
        console.log(res)
        if (issuccess === 1) {
          this.setData({
            equitys: data.allEquities,
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
            console.log(this.data.user, this.data.levels)
          })
        }
      } catch (e) {
        console.log(e)
      }
    })

    // 获取所有的等级和权益 
    api.getAllLevelsAndEquitys(res => {
      console.log(res)
      try {
        const {
          issuccess,
          data
        } = res.data
        if (issuccess === 1) {
          let length = 0
          data.forEach(item => {
            if (item.Equities.length > length) {
              length = item.Equities.length
            }
          })
          console.log(length)
          this.setData({
            levels: data,
            length
          })
        }
      } catch (e) {
        console.log(e)
      }
    })
  }
})