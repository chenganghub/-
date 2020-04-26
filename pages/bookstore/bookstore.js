const api = new (require('../../utils/api.js'))()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    staticimg: api.getstaticimg(),
    start: 0,
    pagesize: 20
  },

  getdata() {
    const { start, pagesize } = this.data
    api.getBookList(
      {
        userId: wx.getStorageSync('user').id,
        start,
        pagesize
      },
      res => {
        if (res.data.issuccess == 1) {
          this.setData({
            list: res.data.list
          })
        }
      }
    )
  },

  toDetail(e) {
    const { index } = e.currentTarget.dataset
    const selectItem = this.data.list[index]
    if (selectItem.isGet) {
      wx.navigateTo({
        url: '/pages/bookstoreDetail/bookstoreDetail?id=' + selectItem.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getdata()
  }
})
