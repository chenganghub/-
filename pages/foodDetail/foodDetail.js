var that,
  api = new (require('../../utils/api.js'))(),
  staticimg = api.getstaticimg(),
  app = getApp(),
  headimg = api.getimgurl(),
  util = new (require('../../utils/util.js'))()
var snow = require('../../utils/snow.js')
var actionFlag = false

Page({
  /**
   * 页面的初始数据
   */
  data: {
    headimg: api.getimgurl(),
    staticimg: api.getstaticimg(),
    currentSelect: 0,
    waterpng: api.getstaticimg() + 'water.png',
    foodImg: '',
    snowAni: '',
    seasoningList: [],
    lengendList: [],
    left: 0,
    top: 0,
    condimentlist: [],
    navHeight: '',
    statusHeight: '',
    title: '千禾味业'
  },
  onShow() {
    actionFlag = false
  },
  onLoad(options) {
    that = this
    let { condimentlist } = that.data,
      seasoningList = []
    let page = getCurrentPages()
    page = page[page.length - 2]
    that.setData({
      item: page.data.selectitem,
      dishid: page.data.selectitem.id,
      isX: app.globalData.isIphoneX
    })
    wx.setStorageSync('dishid', page.data.selectitem.id)
    api.gettwplist(res => {
      if (res.data.issuccess == 1) {
        res.data.list.forEach((x, i) => {
          let newsrc = headimg + x.thumbpath

          let item = {
              state: x.state,
              label: x.name,
              value: '123123',
              imgUrl: newsrc,
              step: x.peerscore,
              active: false
            },
            aitem = {
              label: x.name,
              mount: 0,
              active: !1
            }
          condimentlist.push(item)
          seasoningList.push(aitem)
        })
        that.setData({
          condimentlist,
          seasoningList,
          twplist: res.data.list,
          resetlist: seasoningList
        })
      }
    })
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
  confrim: function() {
    let { seasoningList, twplist } = this.data,
      data = {
        acidity: 0,
        chando: 0,
        saltness: 0,
        spicy: 0,
        sweetness: 0,
        freshness: 0
      }
    seasoningList.forEach((x, i) => {
      data['acidity'] +=
        x.mount > twplist[i]['acidity'] ? twplist[i]['acidity'] : x.mount
      data['chando'] +=
        x.mount > twplist[i]['chando'] ? twplist[i]['chando'] : x.mount

      data['saltness'] +=
        x.mount > twplist[i]['saltness'] ? twplist[i]['saltness'] : x.mount

      data['spicy'] +=
        x.mount > twplist[i]['spicy'] ? twplist[i]['spicy'] : x.mount

      data['sweetness'] +=
        x.mount > twplist[i]['sweetness'] ? twplist[i]['sweetness'] : x.mount

      data['freshness'] +=
        x.mount > twplist[i]['freshness'] ? twplist[i]['freshness'] : x.mount
    })
    api.getrank(data, res => {
      if (res.data.issuccess == 1 && res.data.data) {
        //没得到称号咋办
        that.setData(
          {
            getrank: res.data.data
          },
          () => {
            wx.navigateTo({
              url: '../foodShare/foodShare'
            })
          }
        )
      }else{
        wx.showToast({
          icon:'none',
          title: '制作失败',
        })
      }
    })

    that.setData({
      data
    })
  },
  reset: function() {
    let { twplist } = this.data,
      seasoningList = []
    twplist.forEach(x => {
      let aitem = {
        label: x.name,
        mount: 0,
        active: !1
      }
      seasoningList.push(aitem)
    })

    that.setData({
      seasoningList,
      data: {}
    })
    console.log('重置')
  },
  // 动画
  addSeasoning: function(e) {
    if (actionFlag) {
      return
    }
    actionFlag = true
    let pagX = e.detail.x,
      pagY = e.detail.y,
      { left, condimentlist, seasoningList } = this.data,
      { item, index } = e.currentTarget.dataset,
      curIndex = index,
      { value, step, imgUrl, state } = item,
      changeIndex = seasoningList.findIndex(e => {
        return e.value === value
      })
    if (state == 'GTKL') {
      that.setData({
        currentSelect: 2
      })
      setTimeout(() => {
        snow.play()
        setTimeout(() => {
          snow.stop()
          // that.setData({
          //   currentSelect: 0
          // })
        }, 1500)
      }, 1000)
    } else {
      that.setData({
        currentSelect: 0
      })
    }
    that.setData({
      waterpng: staticimg + (state == 'YTTM' ? 'twater.png' : 'water.png')
    })

    seasoningList[index].mount += Number(step)
    seasoningList[index].active = true
    var animation1 = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    var animation2 = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    var animation3 = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    var ani_water_reset = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })

    var snowAni = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out',
      delay: 500
    })

    if (pagX > 187.5) {
      ani_water_reset
        .left(-5)
        .top(30)
        .opacity(1)
        .step()
    } else {
      ani_water_reset
        .left(60)
        .top(30)
        .opacity(1)
        .step()
    }

    animation1.opacity(1).step()
    animation3.opacity(1).step()
    animation2
      .opacity(1)
      .top(pagY - 150)
      .left(pagX)
      .step()
    condimentlist.forEach(e => {
      e.active = false
    })

    this.setData(
      {
        condimentlist,
        left: pagX,
        top: pagY,
        bottleimg: imgUrl,
        ani: animation1.export(),
        ani2: animation2.export(),
        ani3: animation3.export(),
        ani_water: ani_water_reset.export(),
        mainactive: false
      },
      () => {
        setTimeout(() => {
          var animation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'ease',
            delay: 500
          })
          var animation2 = wx.createAnimation({
            duration: 1200,
            timingFunction: 'ease-out',
            delay: 100
          })
          var animation3 = wx.createAnimation({
            duration: 1200,
            timingFunction: 'ease-out',
            delay: 100
          })
          animation
            .opacity(0)
            .top(-20)
            .step()
          animation2
            .top(110)
            .left(pagX > 187.5 ? 187 : 120)
            .opacity(1)
            .step()
          animation3.rotate(pagX > 187.5 ? -80 : 80).step()

          condimentlist.forEach(e => {
            e.active = false
            condimentlist[curIndex].active = true
          })
          this.setData(
            {
              ani: animation.export(),
              condimentlist,
              seasoningList,
              ani2: animation2.export(),
              ani3: animation3.export()
            },
            () => {
              var ani_water = wx.createAnimation({
                duration: 2000,
                timingFunction: 'ease-out',
                delay: 0
              })
              setTimeout(() => {
                //水滴动画开始；
                animation
                  .opacity(0)
                  .top(0)
                  .step()
                animation3.opacity(0).step()
                if (pagX > 187.5) {
                  ani_water
                    .opacity(0)
                    .top(44)
                    .step()
                } else {
                  ani_water
                    .opacity(0)
                    .top(44)
                    .step()
                }

                if (state == 'GTKL') {
                  console.log('snowAni')
                  snowAni
                    .opacity(1)
                    .step()
                    .opacity(0)
                    .step({
                      delay: 500
                    })
                }

                this.setData(
                  {
                    ani: animation.export(),
                    ani3: animation3.export(),
                    ani_water: ani_water.export(),
                    snowAni: snowAni.export(),
                    condimentlist,
                    mainactive: true
                  },
                  () => {
                    // 复原
                    setTimeout(() => {
                      ani_water
                        .opacity(1)
                        .top(30)
                        .step()
                      this.setData({
                        mainactive: false,
                        ani2: animation2.export(),
                        ani3: animation3.export(),
                        ani_water: ani_water.export()
                      })
                    }, 2000)
                    actionFlag = false
                  }
                )
              }, 1200)
            }
          )
        }, 200)
      }
    )
  }
})
