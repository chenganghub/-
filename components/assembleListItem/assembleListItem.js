// components/assembleListItem/assembleListItem.js
var that,
api = new(require('../../utils/api.js'))(),
md5 = require('../../utils/md5.js'),
app = getApp(),
to,
headimg = api.getimgurl(),
util = new(require('../../utils/util.js'))()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: String,
    title: String,
    leftPerson: String,
    leftTime: String,
    list: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    toTime: "",
    lists: []
  },
  
  observers: {
    'list': function (list) {
      this.setData({
        lists: list
      }, () => {
        let than = this
        clearInterval(this.data.toTime)
     
        let {
          lists
        } = this.data;
            // 活动结束时间 单独提出来
            let endTimeList = [];
            // 将活动的结束时间参数提成一个单独的数组，方便操作
            lists.forEach(o => {
               endTimeList.push(o.endtime) 
              })
            // 执行倒计时函数
            util.countDown('countDownList', endTimeList,this)
            console.log(this.data.countDownList,"countDownList")
      })
    }
  },
  goToAssemble(e) {
    clearInterval(this.data.toTime)
    wx.navigateTo({
      url: '/pages/assemble/assemble?id='+JSON.stringify(e.target.dataset.id),
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  ready: function () {
    console.log(this.properties, 1011)
    let than = this
    // 在组件实例进入页面节点树时执行


  },
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
    clearInterval(this.data.toTime)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 参与拼团后
    afterGetAssemble(e) {

      this.triggerEvent('getAssemble', {item:e.target.dataset.item})
    },
    format(i) {
      if (i < 10 && i > 0) {
        return '0' + i
      } else {
        return i
      }
    },
  },
  onHide: function () {
    clearInterval(this.data.toTime)
  },
})