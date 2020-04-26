// components/assembleOrderItem/assembleOrderItem.js
var that,
  WxParse = require('../../wxParse/wxParse.js'),
  api = new(require('../../utils/api.js')),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new(require('../../utils/util.js'));
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showShare: {
      type: Boolean,
      value: false
    },
    showTime: {
      type: Boolean,
      value: false
    },
    active: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    util : new(require('../../utils/util.js')),
    headimg:api.getimgurl(),
    joinModalVisible: false,
    toTime: "",
    imglist:{},
    list: []
  },


  ready() {
console.log(util.timeFormatting('20-12'),888444)
  },
  observers: {
    active: function (active) {
      clearTimeout(this.data.toTime)
      this.orderList()
    }
  },
onHide(){
  console.log(111)
  clearInterval(this.data.toTime)
},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     *  订单列表
     */
    orderList() {
      api.memberOrder({
        userid: JSON.parse(wx.getStorageSync('user').id),
        state: this.properties.active
      }, res => {
        if (res.data.issuccess == 1) {


          this.setData({
            list:res.data.data
          })
          let {
            list
          } = this.data;
          // 活动结束时间 单独提出来
          let endTimeList = [];
          // 将活动的结束时间参数提成一个单独的数组，方便操作
          list.forEach(o => {
            o.specinfo=o.specinfo&&JSON.parse(o.specinfo)
            if(this.data.active==2){
              o.endtime=util.timeFormatting(o.trueendtime)
              o.starttime=util.timeFormatting(o.starttime)
            }else{
              endTimeList.push(o.teamendtime)
              o.endtime=util.timeFormatting(o.endtime)
              o.starttime=util.timeFormatting(o.starttime)
            }
            if (o.members.length < o.personlimit) {
              let EmembersLength = o.personlimit - o.members.length
              for (var i = 0; i < EmembersLength; i++) {
                o.members.push({
                  avatarUrl: "../../pages/pic/grouppng.png"
                })

              }
            }
          })
          console.log(list,77)
          this.setData({
            list
          })
 console.log(list,11)

          // 执行倒计时函数
          util.countDown('countDownList', endTimeList, this)
        
        }
      })
    },
    goGroup(){
      wx.switchTab({
        url:"/pages/classification/classification"
      })
    },
    // 查看已加入的用户
    viewJoinUsers(e) {
      console.log(e.currentTarget.dataset,"e.currentTarget.item")
        this.setData({
          imglist:e.currentTarget.dataset.item,
          joinModalVisible: true
        })
      

    },
    handleCloseJoinModal() {
      this.setData({
        joinModalVisible: false
      })
    },
    // 获取参与拼团的信息
    afterGetAssembleInfo(e) {
      console.log(e,555)
      this.triggerEvent('getAssembleInfo',{item:e.currentTarget.dataset.item})
    },

    // 分享
    handleShare() {
      this.triggerEvent("handleShare")
    }
  }

})