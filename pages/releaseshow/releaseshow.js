// pages/shareadd/shareadd.js
let that,
  api = new (require('../../utils/api.js'))(),
  headurl = api.getheadurl()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgurls: [],
    count: 9,
    contents: '',
    uploading: !1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    this.getsetting()
  },
  getsetting() {
    // api.getsetting(res => {
    //   if (res.data.issuccess == 1) {
    //     let setting = res.data.data,
    //     count = setting.piccount;
    //     wx.setStorageSync("setting",setting)
    //     this.setData({count});
    //   }
    // });
  },
  sub() {
    var { imgurls, contents } = this.data
    if (contents == '') {
      wx.showModal({
        showCancel: !1,
        confirmColor: '#FE8F71',
        title: '提示',
        content: '请添加内容'
      })
      return
    }
    if (imgurls.length <= 0) {
      wx.showModal({
        showCancel: !1,
        title: '提示',
        confirmColor: '#FE8F71',
        content: '请上传图片'
      })
      return
    }
    let uploading = !0
    this.setData({ uploading })
    api.uploadimg(
      {
        url: `${headurl}upload/wx_upload`, //这里是你图片上传的接口
        path: imgurls //这里是选取的图片的地址数组
      },
      {
        success: function(res) {
          if ((res.length = imgurls.length)) {
            console.log('全部上传')
            let pics = res.join(',')
            let data = { imgurls: pics, contents }
            if (pics.length == 0) {
              wx.showModal({
                title: '提示',
                confirmColor: '#FE8F71',
                content: '图片上传失败'
              })
              return
            }
            api.addshows(data, res => {
              if (res.data.issuccess == 1) {
                wx.showModal({
                  content: '发布成功，客服审核中',
                  confirmColor: '#FE8F71',
                  showCancel: !1,
                  success: result => {
                    let pages = getCurrentPages(),
                      page = pages[pages.length - 2]
                    page.data.needupdate = !0
                    wx.navigateBack({
                      delta: 1
                    })
                  },
                  title: '提示'
                })
              } else {
                wx.showModal({
                  title: '提示',
                  confirmColor: '#FE8F71',
                  content: pics.join(',')
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              confirmColor: '#FE8F71',
              content: '上传图片失败'
            })
            that.setData({ imgurls: [] })
          }
          that.setData({ uploading: !1 })
        }
      }
    )
  },
  inputchange(e) {
    var proval = {},
      { prop } = e.target.dataset
    proval[prop] = e.detail.value
    // console.log(proval,prop);
    this.setData(proval)
  },
  previewimage(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imgurls
    })
  },
  chooseimage() {
    let { imgurls, count } = this.data

    wx.chooseImage({
      count: count - imgurls.length,
      success: function(res) {
        imgurls = imgurls.concat(res.tempFilePaths)
        that.setData({
          imgurls
        })
      }
    })
  },
  del(e) {
    let { index } = e.currentTarget.dataset,
      { imgurls } = this.data
    imgurls.splice(index, 1)
    this.setData({ imgurls })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
