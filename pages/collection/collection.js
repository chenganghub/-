// pages/collection/collection.js
var that,
  api = new(require('../../utils/api.js')),
  headimg = api.getimgurl(),
  app = getApp(),
  util = new(require('../../utils/util.js')),
  headimg = api.getimgurl()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagesize: 10,
    start: 0,
    headimg,
    goods: [],
    selectAllState: false,
    control: false,
  },

  // 控制管理
  showControl() {
    this.setData({
      control: true
    })
  },

  // 跳转商品详情
  goToDetail({
    currentTarget
  }) {
    console.log(currentTarget)
    const type = currentTarget.dataset.type
    const id = currentTarget.dataset.itemid
    const state = currentTarget.dataset.state
    if (state === '1') {
      wx.showToast({
        title: '商品已下架',
        icon: 'none'
      })
      return
    }
    switch (type) {
      case '1':
        {
          // 普通
          wx.navigateTo({
            url: `/pages/goodsDetail/goodsDetail?id=${id}`,
          })
          break
        }
      case '2':
        {
          // 积分
          wx.navigateTo({
            url: `/pages/integraldetails/integraldetails?id=${id}`,
          })
          break
        }
      case '3':
        {
          // 拼团
          wx.navigateTo({
            url: `/pages/assemble/assemble?id=${id}`,
          })
          break
        }

    }

  },
  //全选
  selectAll() {
    const {
      goods,
      selectAllState
    } = this.data
    Array.isArray(goods) && goods.forEach(item => {
      if (item.item.type === '1' || item.item.type === '3') {
        if (selectAllState) {
          item.goods.selected = false
        } else {
          item.goods.selected = true
        }
      } else {
        if (selectAllState) {
          item.scoregoods.selected = false
        } else {
          item.scoregoods.selected = true
        }
      }


    })
    this.setData({
      goods,
      selectAllState: !this.data.selectAllState
    })
  },

  //去收藏
  goCollection() {
    console.log('111')
    wx.switchTab({
      url: '/pages/classification/classification',
    })
  },

  // 反向全选
  getSelectAll() {
    const {
      goods
    } = this.data
    for (let i = 0; i < goods.length; i++) {
      const el = goods[i]
      if (el.item.type === '1' || el.item.type === '3') {
        // 普通
        if (!el.goods.selected) {
          return false
        }
      } else if (el.item.type === '2') {
        // 积分
        if (!el.scoregoods.selected) {
          return false
        }
      }

    }
    return true
  },

  // 获取列表
  getCollectionsList() {
    const {
      goods,
      start
    } = this.data
    const data = {
      start: this.data.start,
      pagesize: this.data.pagesize,
      // userid: wx.getStorageSync('userid')
    }
    api.getCollections(data, res => {
      const {
        list,
        start
      } = res.data
      if (list.length <= 0) {
        this.setData({
          start: --this.data.start,
          goods: []
        })
      } else {
        Array.isArray(list) && list.forEach(item => {
          if (item.item.type === '1' || item.item.type === '3') {
            // 普通 拼团
            if (item.goods) {
              item.goods.selected = item.goods && false

              const userid = wx.getStorageSync('user').id
  
              if (!userid || userid === '') {
                item.goods.showPrice = item.goods.price
              } else {
                item.goods.showPrice = item.goods.teamprice
              }
              console.log('11', item.goods.showPrice)

            }
          } else if (item.item.type === '2') {
            // 积分
            if (item.scoregoods) {
              item.scoregoods.selected = item.scoregoods && false
            }
          }
        })
        if (start === 0) {
          this.setData({
            goods: list || []
          })
        } else {
          this.setData({
            goods: goods.concat([...list]) || []
          })
        }

      }

    })
  },

  // 删除
  del() {
    const {
      goods
    } = this.data

    const data = []
    goods.forEach(item => {
      if (item.item.type === '1' || item.item.type === '3') {
        // 普通
        if (item.goods && item.goods.selected) {
          data.push(item.item.id)
        }
      } else if (item.item.type === '2') {
        // 积分
        if (item.scoregoods.selected) {
          data.push(item.item.id)
        }
      }
    })
    console.log(data)

    api.delCollect({
      ids: JSON.stringify(data)
    }, res => {
      if (res.data.issuccess === 1) {
        wx.showToast({
          title: '删除成功',
        })
        this.data.goods = []
        this.setData({
          start: 0,
        }, () => {
          this.getCollectionsList()
        })
      }
    })
  },

  //完成操作
  finish() {
    const {
      goods
    } = this.data
    Array.isArray(goods) && goods.forEach(item => {

      if (item.item.type === '1' || item.item.type === '3') {
        // 普通
        if (item.goods) {
          item.goods.selected = false
        }
      } else if (item.item.type === '2') {
        // 积分
        if (item.scoregoods) {
          item.scoregoods.selected = false
        }
      }
    })
    this.setData({
      control: false,
      selectAllState: false,
      goods
    })
  },

  // 选择商品
  onSelect(e) {
    const {
      control
    } = this.data
    if (control) {
      const {
        currentTarget
      } = e
      const {
        goods
      } = this.data

      const id = currentTarget.dataset.id
      const index = goods.findIndex(item => item.item.id === id)
      if (index > -1) {
        if (goods[index].item.type === '1' || goods[index].item.type === '3') {
          goods[index].goods.selected = !goods[index].goods.selected

        } else if (goods[index].item.type === '2') {
          goods[index].scoregoods.selected = !goods[index].scoregoods.selected

        }
      }
      this.setData({
        goods,
        selectAllState: this.getSelectAll() ? true : false
      })
    } else {
      this.goToDetail(e)
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCollectionsList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      start: ++this.data.start
    }, () => {
      this.getCollectionsList()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})