// components/modal/modal.js
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
    list:Array
  },
  options: {

  },


  /**
   * 组件的初始数据
   */
  data: {
  lists:[],
  detailid:"",
    toTime:"",
    inputValue: ""
  },
  attached() {

  },
  observers: {
    'list': function (list) {
      this.setData({
        lists: list
      }, () => {
        clearInterval(this.data.toTime)
        let than = this
        let {
          lists
        } = this.data;
               // 活动结束时间 单独提出来
               let endTimeList = [];
               // 将活动的结束时间参数提成一个单独的数组，方便操作
               lists.forEach(o => { endTimeList.push(o.endtime) })
               // 执行倒计时函数
               util.countDown('countDownList', endTimeList,this)
               console.log(this.data.countDownList,"countDownList")
      })
    }
  },
  onHide: function () {
    clearInterval(this.data.toTime)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    format(i) {
      if (i < 10 && i > 0) {
        return '0' + i
      } else {
        return i
      }
    },
    //去拼团
    goGroup(e) {
  let{item}=e.target.dataset
      wx.setStorageSync('userid', item.userid)
      wx.setStorageSync('groupid', item.id)
      wx.navigateTo({
        url: `/pages/assemble/assemble?id=${JSON.stringify(item.actid)}&detailid=${item.detailid}&group=true"`,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    /**
     * 输入框点击
     */
    inputClick(e) {
      wx.navigateTo({
        url: '/pages/search/search'
      })
    },

    /**
     * 取消按钮
     */
    cancelClick() {
      this.triggerEvent("cancelClick", false)
    },

  }
})