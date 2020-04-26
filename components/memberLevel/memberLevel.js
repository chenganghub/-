// components/memberLevel.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // difference: 0,
    gradeId: {
      type: Number,
      value: 0
    },
    growthName: {
      type: String,
      value: ''
    },
    userGrowth: {
      type: Number,
      value: 0
    },
    maxGrowth: {
      type: Number,
      value: 0
    },
    difference: {
      type: Number,
      value: 0
    },
    nextGradeName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    growthPx: 0,
    dom: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 计算成长值
    countGrowth() {
      try {
        console.log('maxGrowth', this.properties.maxGrowth, 'userGrowth', this.properties.userGrowth)

        const userGrowth = this.data.userGrowth
        const maxGrowth = this.data.maxGrowth
        const query = wx.createSelectorQuery().in(this)
        query.select('.progress').boundingClientRect()
        query.exec(res => {
          console.log(maxGrowth)
          this.setData({
            growthPx: (userGrowth / maxGrowth) * res[0].width
          }, () => {
            console.log(this.data.growthPx)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    toMemberRules(){
      console.log(22)
      wx.navigateTo({
        url: '/pages/memberRules/memberRules',
      })
    }
  },
  observers: {
    'maxGrowth': function(rate) {
      this.countGrowth()
    }
  },

  lifetimes: {
    ready: function() {
      this.countGrowth()
    }
  }
})